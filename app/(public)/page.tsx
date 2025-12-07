import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Vehicle } from '@/lib/types';
import { VehicleCard } from '@/components/vehicles/vehicle-card';

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient();

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select(
      `
      *,
      images:vehicle_images(*)
    `
    )
    .eq('destacado', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured vehicles:', error);
    return [];
  }

  return vehicles || [];
}

export default async function Home() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <div>
      {/* Featured Vehicles Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Vehículos Destacados
            </h2>
            <p className="text-lg text-gray-600">
              Descubre nuestra selección de vehículos destacados
            </p>
          </div>

          {featuredVehicles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-600">
                Próximamente tendremos vehículos destacados para ti.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/vehiculos"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-base font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Ver Todos los Vehículos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
