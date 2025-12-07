import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const vehicleId = formData.get('vehicleId') as string;
    const isPrimary = formData.get('isPrimary') === 'true';
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;

    if (!file || !vehicleId) {
      return NextResponse.json(
        { success: false, error: 'Archivo o ID de vehículo faltante' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no válido. Solo se permiten JPG, PNG y WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'El archivo es demasiado grande. Tamaño máximo: 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${vehicleId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('vehicle-images')
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Error al subir imagen: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('vehicle-images').getPublicUrl(fileName);

    // If this is set as primary, unset other primary images
    if (isPrimary) {
      await supabaseAdmin
        .from('vehicle_images')
        .update({ is_primary: false })
        .eq('vehicle_id', vehicleId);
    }

    // Save image record to database
    const { data: imageRecord, error: dbError } = await supabaseAdmin
      .from('vehicle_images')
      .insert({
        vehicle_id: vehicleId,
        url: publicUrl,
        is_primary: isPrimary,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: `Error en la base de datos: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: imageRecord });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al subir imagen' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'ID de imagen faltante' },
        { status: 400 }
      );
    }

    // Get image URL
    const { data: image } = await supabaseAdmin
      .from('vehicle_images')
      .select('url')
      .eq('id', imageId)
      .single();

    if (image) {
      // Extract filename from URL
      const url = new URL(image.url);
      const fileName = url.pathname.split('/').pop();

      if (fileName) {
        // Delete from storage
        await supabaseAdmin.storage
          .from('vehicle-images')
          .remove([fileName]);
      }
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('vehicle_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar imagen' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { imageId, isPrimary } = body;

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'ID de imagen faltante' },
        { status: 400 }
      );
    }

    // Get vehicle_id for this image
    const { data: image } = await supabaseAdmin
      .from('vehicle_images')
      .select('vehicle_id')
      .eq('id', imageId)
      .single();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    // If setting as primary, unset other primary images for this vehicle
    if (isPrimary) {
      await supabaseAdmin
        .from('vehicle_images')
        .update({ is_primary: false })
        .eq('vehicle_id', image.vehicle_id);
    }

    // Update this image
    const { data: updatedImage, error } = await supabaseAdmin
      .from('vehicle_images')
      .update({ is_primary: isPrimary })
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: updatedImage });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar imagen' },
      { status: 500 }
    );
  }
}
