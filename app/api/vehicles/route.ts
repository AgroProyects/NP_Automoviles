import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: vehicles, error } = await supabaseAdmin
      .from('vehicles')
      .select(
        `
        *,
        images:vehicle_images(*)
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener vehículos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { data: vehicle, error } = await supabaseAdmin
      .from('vehicles')
      .insert({
        marca: body.marca,
        modelo: body.modelo,
        anio: body.anio,
        precio: body.precio,
        kilometraje: body.kilometraje,
        combustible: body.combustible,
        transmision: body.transmision,
        descripcion: body.descripcion,
        color: body.color,
        destacado: body.destacado || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear vehículo' },
      { status: 500 }
    );
  }
}
