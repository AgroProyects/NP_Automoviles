import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/lib/types';
import { formatPrice, formatKilometers, getVehicleSlug } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Gauge, Fuel, Settings } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const primaryImage = vehicle.images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.url || vehicle.images?.[0]?.url;
  const slug = getVehicleSlug(vehicle);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/vehiculos/${slug}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-lg">Sin imagen</span>
            </div>
          )}
          {vehicle.destacado && (
            <div className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              Destacado
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/vehiculos/${slug}`}>
          <h3 className="mb-2 text-xl font-bold text-gray-900 hover:text-primary">
            {vehicle.marca} {vehicle.modelo}
          </h3>
        </Link>

        <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{vehicle.anio}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4 text-primary" />
            <span>{formatKilometers(vehicle.kilometraje)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4 text-primary" />
            <span>{vehicle.combustible}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4 text-primary" />
            <span>{vehicle.transmision}</span>
          </div>
        </div>

        <p className="mb-4 text-2xl font-bold text-primary">
          {formatPrice(vehicle.precio)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link
          href={`/vehiculos/${slug}`}
          className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Ver Detalles
        </Link>
      </CardFooter>
    </Card>
  );
}
