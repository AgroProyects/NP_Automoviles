import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { VehicleForm } from '@/components/admin/vehicle-form';
import { Vehicle, VehicleImage } from '@/lib/types';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getVehicle(id: string): Promise<Vehicle | null> {
  const { data: vehicle, error } = await supabaseAdmin
    .from('vehicles')
    .select(
      `
      *,
      images:vehicle_images(*)
    `
    )
    .eq('id', id)
    .single();

  if (error || !vehicle) {
    return null;
  }

  // Sort images by is_primary and display_order
  if (vehicle.images) {
    vehicle.images.sort((a: VehicleImage, b: VehicleImage) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return a.display_order - b.display_order;
    });
  }

  return vehicle;
}

export default async function EditarVehiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicle(id);

  if (!vehicle) {
    notFound();
  }

  return <VehicleForm vehicle={vehicle} />;
}
