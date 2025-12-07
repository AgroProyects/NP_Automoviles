import { createClient } from '@/lib/supabase/server';
import { Vehicle, VehicleFilters as Filters } from '@/lib/types';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { VehicleFilters } from '@/components/vehicles/vehicle-filters';

async function getAvailableBrands(): Promise<string[]> {
  const supabase = await createClient();

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('marca');

  if (error || !vehicles) {
    return [];
  }

  const brands = Array.from(new Set(vehicles.map((v) => v.marca))).sort();
  return brands;
}

async function getVehicles(filters: Filters): Promise<Vehicle[]> {
  const supabase = await createClient();

  let query = supabase.from('vehicles').select(
    `
      *,
      images:vehicle_images(*)
    `
  );

  // Apply filters
  if (filters.search) {
    query = query.or(
      `marca.ilike.%${filters.search}%,modelo.ilike.%${filters.search}%`
    );
  }

  if (filters.marca) {
    query = query.eq('marca', filters.marca);
  }

  if (filters.combustible) {
    query = query.eq('combustible', filters.combustible);
  }

  if (filters.transmision) {
    query = query.eq('transmision', filters.transmision);
  }

  if (filters.anioMin) {
    query = query.gte('anio', filters.anioMin);
  }

  if (filters.anioMax) {
    query = query.lte('anio', filters.anioMax);
  }

  if (filters.precioMin) {
    query = query.gte('precio', filters.precioMin);
  }

  if (filters.precioMax) {
    query = query.lte('precio', filters.precioMax);
  }

  query = query.order('created_at', { ascending: false });

  const { data: vehicles, error } = await query;

  if (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }

  return vehicles || [];
}

export default async function VehiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters: Filters = {
    search: typeof params.search === 'string' ? params.search : undefined,
    marca: typeof params.marca === 'string' ? params.marca : undefined,
    combustible:
      typeof params.combustible === 'string' ? params.combustible : undefined,
    transmision:
      typeof params.transmision === 'string' ? params.transmision : undefined,
    anioMin:
      typeof params.anioMin === 'string' ? parseInt(params.anioMin) : undefined,
    anioMax:
      typeof params.anioMax === 'string' ? parseInt(params.anioMax) : undefined,
    precioMin:
      typeof params.precioMin === 'string'
        ? parseFloat(params.precioMin)
        : undefined,
    precioMax:
      typeof params.precioMax === 'string'
        ? parseFloat(params.precioMax)
        : undefined,
  };

  const vehicles = await getVehicles(filters);
  const availableBrands = await getAvailableBrands();

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Nuestros Vehículos
          </h1>
          <p className="text-lg text-gray-600">
            Encuentra el vehículo perfecto para ti
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <VehicleFilters availableBrands={availableBrands} />
          </aside>

          <main className="lg:col-span-3">
            {vehicles.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-600">
                  Mostrando {vehicles.length}{' '}
                  {vehicles.length === 1 ? 'vehículo' : 'vehículos'}
                </p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <p className="text-lg text-gray-600">
                  No se encontraron vehículos que coincidan con tus criterios de
                  búsqueda.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Intenta ajustar los filtros para ver más resultados.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
