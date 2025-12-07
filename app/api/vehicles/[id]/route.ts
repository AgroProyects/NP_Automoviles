import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { data: vehicle, error } = await supabaseAdmin
      .from('vehicles')
      .update({
        marca: body.marca,
        modelo: body.modelo,
        anio: body.anio,
        precio: body.precio,
        kilometraje: body.kilometraje,
        combustible: body.combustible,
        transmision: body.transmision,
        descripcion: body.descripcion,
        color: body.color,
        destacado: body.destacado,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar vehículo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // First, get all images to delete from storage
    const { data: images } = await supabaseAdmin
      .from('vehicle_images')
      .select('url')
      .eq('vehicle_id', id);

    // Delete images from storage
    if (images && images.length > 0) {
      const filePaths = images.map((img) => {
        const url = new URL(img.url);
        return url.pathname.split('/').pop() || '';
      });

      await supabaseAdmin.storage
        .from('vehicle-images')
        .remove(filePaths.filter((p) => p));
    }

    // Delete vehicle (cascade will delete vehicle_images)
    const { error } = await supabaseAdmin
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar vehículo' },
      { status: 500 }
    );
  }
}
