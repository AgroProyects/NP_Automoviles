import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/lib/types';
import { formatPrice, formatKilometers, getVehicleSlug } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Gauge, Fuel, Settings, Award, Car, ImageIcon, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const primaryImage = vehicle.images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.url || vehicle.images?.[0]?.url;
  const slug = getVehicleSlug(vehicle);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 bg-white">
      <Link href={`/vehiculos/${slug}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="text-center">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500 text-sm font-medium">Imagen próximamente</span>
              </div>
            </div>
          )}

          {/* Featured badge */}
          {vehicle.destacado && (
            <div className="absolute right-3 top-3 z-20 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1.5 shadow-lg">
                <Award className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-bold text-white">Destacado</span>
              </div>
            </div>
          )}

          {/* Image count indicator */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="absolute left-3 bottom-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1">
              <ImageIcon className="h-3 w-3 text-white" />
              <span className="text-xs font-semibold text-white">{vehicle.images.length}</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-5">
        <Link href={`/vehiculos/${slug}`}>
          <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {vehicle.marca} {vehicle.modelo}
          </h3>
        </Link>

        {/* Enhanced specs grid */}
        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg transition-colors hover:bg-primary/5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Año</span>
              <span className="text-sm font-bold text-gray-900">{vehicle.anio}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg transition-colors hover:bg-primary/5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Gauge className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Km</span>
              <span className="text-sm font-bold text-gray-900">{formatKilometers(vehicle.kilometraje)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg transition-colors hover:bg-primary/5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Fuel className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Combustible</span>
              <span className="text-sm font-bold text-gray-900 line-clamp-1">{vehicle.combustible}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg transition-colors hover:bg-primary/5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Transmisión</span>
              <span className="text-sm font-bold text-gray-900 line-clamp-1">{vehicle.transmision}</span>
            </div>
          </div>
        </div>

        {/* Enhanced price display */}
        <div className="mb-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
          <p className="text-xs text-gray-600 font-medium mb-0.5">Precio</p>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(vehicle.precio)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link
          href={`/vehiculos/${slug}`}
          className="group/btn w-full inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Ver Detalles
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
