import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Vehicle, VehicleImage } from '@/lib/types';
import {
  formatPrice,
  formatKilometers,
  getWhatsAppLink,
  parseVehicleSlug,
} from '@/lib/utils';
import { ImageCarousel } from '@/components/vehicles/image-carousel';
import { CopyLinkButton } from '@/components/vehicles/copy-link-button';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  ArrowLeft,
  Phone,
  CheckCircle2,
  Shield,
  Award,
  MapPin,
} from 'lucide-react';

// WhatsApp Logo SVG Component
function WhatsAppLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-5.253 1.408 1.417-5.228-0.321-0.519c-1.351-2.2-2.067-4.737-2.067-7.365 0-7.692 6.275-13.967 13.967-13.967s13.967 6.275 13.967 13.967-6.275 13.967-13.967 13.967zM21.617 19.671c-0.38-0.19-2.243-1.106-2.592-1.232-0.348-0.127-0.602-0.19-0.854 0.19s-0.981 1.232-1.203 1.485c-0.221 0.253-0.443 0.285-0.822 0.095s-1.603-0.591-3.052-1.884c-1.129-1.006-1.89-2.249-2.112-2.628s-0.024-0.584 0.166-0.773c0.171-0.171 0.38-0.443 0.57-0.665s0.253-0.38 0.38-0.633c0.127-0.253 0.063-0.475-0.032-0.665s-0.854-2.056-1.171-2.816c-0.31-0.741-0.623-0.641-0.854-0.653-0.221-0.011-0.475-0.013-0.728-0.013s-0.665 0.095-1.013 0.475c-0.348 0.38-1.329 1.298-1.329 3.166s1.361 3.67 1.551 3.924c0.19 0.253 2.678 4.091 6.489 5.738 0.907 0.392 1.616 0.626 2.168 0.802 0.912 0.289 1.741 0.249 2.396 0.151 0.731-0.109 2.243-0.917 2.561-1.803s0.317-1.645 0.222-1.803c-0.095-0.158-0.348-0.253-0.728-0.443z"/>
    </svg>
  );
}

async function getVehicle(slug: string): Promise<Vehicle | null> {
  const idPrefix = parseVehicleSlug(slug);
  if (!idPrefix) return null;

  const supabase = await createClient();

  // Try to use RPC function first (requires migration)
  const { data: vehicleData, error: rpcError } = await supabase
    .rpc('get_vehicle_by_id_prefix', { id_prefix: idPrefix });

  if (!rpcError && vehicleData && vehicleData.length > 0) {
    const vehicleId = vehicleData[0].id;

    // Fetch images separately
    const { data: images } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('display_order');

    const vehicle = { ...vehicleData[0], images: images || [] };

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

  // Fallback: fetch all vehicles and filter client-side
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select(
      `
      *,
      images:vehicle_images(*)
    `
    );

  if (error || !vehicles) {
    console.error('Error fetching vehicles:', error);
    return null;
  }

  // Find the vehicle whose ID starts with the prefix
  const vehicle = vehicles.find((v) => v.id.toLowerCase().startsWith(idPrefix.toLowerCase()));

  if (!vehicle) {
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

export default async function VehiculoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    notFound();
  }

  const whatsappLinkNestor = getWhatsAppLink(
    vehicle.marca,
    vehicle.modelo,
    vehicle.anio,
    'nestor'
  );

  const whatsappLinkEmanuel = getWhatsAppLink(
    vehicle.marca,
    vehicle.modelo,
    vehicle.anio,
    'emanuel'
  );

  const features = [
    'Documentación al día',
    'Verificación policial',
    'Buen trato',
    'Financiamiento por banco',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb / Back Navigation */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 md:top-16 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <Link
            href="/vehiculos"
            className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-gray-600 hover:text-[#044bab] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 lg:py-12">
        {/* Mobile: Title and Price at Top */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {vehicle.marca} {vehicle.modelo}
          </h1>
          <div className="bg-gradient-to-r from-[#044bab] to-[#3495ca] text-white rounded-xl p-5 text-center shadow-lg">
            <p className="text-xs font-medium mb-1 opacity-90">Precio</p>
            <p className="text-3xl font-bold">
              {formatPrice(vehicle.precio)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Image Carousel */}
            <div className="relative rounded-xl lg:rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl bg-white p-2 md:p-4">
              <ImageCarousel
                images={vehicle.images || []}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
              />
              {vehicle.destacado && (
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg">
                    <Award className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="font-bold text-xs md:text-sm">Destacado</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: Specifications Grid */}
            <div className="lg:hidden bg-white rounded-xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Especificaciones
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#044bab] mb-2" />
                  <p className="text-xs text-gray-600 font-medium">Año</p>
                  <p className="text-base font-bold text-gray-900">{vehicle.anio}</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Gauge className="h-5 w-5 text-[#044bab] mb-2" />
                  <p className="text-xs text-gray-600 font-medium">Kilometraje</p>
                  <p className="text-base font-bold text-gray-900">
                    {formatKilometers(vehicle.kilometraje)}
                  </p>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Fuel className="h-5 w-5 text-[#044bab] mb-2" />
                  <p className="text-xs text-gray-600 font-medium">Combustible</p>
                  <p className="text-base font-bold text-gray-900">
                    {vehicle.combustible}
                  </p>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Settings className="h-5 w-5 text-[#044bab] mb-2" />
                  <p className="text-xs text-gray-600 font-medium">Transmisión</p>
                  <p className="text-base font-bold text-gray-900">
                    {vehicle.transmision}
                  </p>
                </div>
                {vehicle.color && (
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg col-span-2">
                    <Palette className="h-5 w-5 text-[#044bab] mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Color</p>
                    <p className="text-base font-bold text-gray-900">
                      {vehicle.color}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            {vehicle.descripcion && (
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-5 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-[#044bab]" />
                  Descripción del Vehículo
                </h2>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  {vehicle.descripcion}
                </p>
              </div>
            )}

            {/* Features Card */}
            <div className="bg-gradient-to-br from-[#044bab] to-[#3495ca] rounded-xl lg:rounded-2xl shadow-lg p-5 md:p-8 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 md:h-6 md:w-6" />
                ¿Por qué elegirnos?
              </h2>
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details & Contact */}
          <div className="space-y-4 lg:space-y-6">
            {/* Main Info Card - Desktop Only for Title/Price */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-xl p-8 sticky top-32">
              {/* Title and Price */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {vehicle.marca} {vehicle.modelo}
                </h1>
                <div className="bg-gradient-to-r from-[#044bab] to-[#3495ca] text-white rounded-xl p-6 text-center">
                  <p className="text-sm font-medium mb-1 opacity-90">Precio</p>
                  <p className="text-4xl font-bold">
                    {formatPrice(vehicle.precio)}
                  </p>
                </div>
              </div>

              {/* Specifications Grid - Desktop Only */}
              <div className="space-y-3 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Especificaciones
                </h3>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#044bab]/10">
                    <Calendar className="h-6 w-6 text-[#044bab]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Año</p>
                    <p className="text-lg font-bold text-gray-900">{vehicle.anio}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#044bab]/10">
                    <Gauge className="h-6 w-6 text-[#044bab]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Kilometraje</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatKilometers(vehicle.kilometraje)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#044bab]/10">
                    <Fuel className="h-6 w-6 text-[#044bab]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Combustible</p>
                    <p className="text-lg font-bold text-gray-900">
                      {vehicle.combustible}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#044bab]/10">
                    <Settings className="h-6 w-6 text-[#044bab]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Transmisión</p>
                    <p className="text-lg font-bold text-gray-900">
                      {vehicle.transmision}
                    </p>
                  </div>
                </div>

                {vehicle.color && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#044bab]/10">
                      <Palette className="h-6 w-6 text-[#044bab]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">Color</p>
                      <p className="text-lg font-bold text-gray-900">
                        {vehicle.color}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 text-center">
                    Consultar por WhatsApp
                  </p>
                  <a
                    href={whatsappLinkNestor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white transition-all hover:bg-[#128C7E] hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <WhatsAppLogo className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Néstor - 098 181 869
                  </a>
                  <a
                    href={whatsappLinkEmanuel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white transition-all hover:bg-[#128C7E] hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <WhatsAppLogo className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Emanuel - 099 465 511
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+59898181869"
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white border-2 border-[#044bab] px-4 text-sm font-bold text-[#044bab] transition-all hover:bg-[#044bab] hover:text-white hover:shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                    Néstor
                  </a>
                  <a
                    href="tel:+59899465511"
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white border-2 border-[#044bab] px-4 text-sm font-bold text-[#044bab] transition-all hover:bg-[#044bab] hover:text-white hover:shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                    Emanuel
                  </a>
                </div>

                <CopyLinkButton className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 font-semibold text-sm" />

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-[#044bab]" />
                    <span className="font-medium">Nueva Helvecia, Colonia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Contact Card */}
            <div className="lg:hidden bg-white rounded-xl shadow-xl p-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-700 text-center">
                  Consultar por WhatsApp
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={whatsappLinkNestor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex flex-col items-center justify-center gap-1 h-14 rounded-lg bg-[#25D366] px-2 text-white transition-all hover:bg-[#128C7E] active:scale-95 shadow-md"
                  >
                    <WhatsAppLogo className="h-5 w-5" />
                    <span className="text-xs font-bold">Néstor</span>
                  </a>
                  <a
                    href={whatsappLinkEmanuel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex flex-col items-center justify-center gap-1 h-14 rounded-lg bg-[#25D366] px-2 text-white transition-all hover:bg-[#128C7E] active:scale-95 shadow-md"
                  >
                    <WhatsAppLogo className="h-5 w-5" />
                    <span className="text-xs font-bold">Emanuel</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+59898181869"
                    className="w-full flex items-center justify-center gap-1 h-10 rounded-lg bg-white border-2 border-[#044bab] px-2 text-xs font-bold text-[#044bab] transition-all hover:bg-[#044bab] hover:text-white shadow-md"
                  >
                    <Phone className="h-3 w-3" />
                    Néstor
                  </a>
                  <a
                    href="tel:+59899465511"
                    className="w-full flex items-center justify-center gap-1 h-10 rounded-lg bg-white border-2 border-[#044bab] px-2 text-xs font-bold text-[#044bab] transition-all hover:bg-[#044bab] hover:text-white shadow-md"
                  >
                    <Phone className="h-3 w-3" />
                    Emanuel
                  </a>
                </div>

                <CopyLinkButton className="w-full h-10 border-2 border-gray-300 hover:bg-gray-50 font-semibold text-xs" />

                <div className="flex items-center justify-center gap-1 text-xs text-gray-700 pt-2 border-t border-gray-200">
                  <MapPin className="h-3 w-3 text-[#044bab]" />
                  <span className="font-medium">Nueva Helvecia, Colonia</span>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-5 lg:p-6 text-center">
              <Shield className="h-10 w-10 lg:h-12 lg:w-12 text-[#044bab] mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2 text-base lg:text-lg">Compra Segura</h3>
              <p className="text-xs lg:text-sm text-gray-600">
                Todos nuestros vehículos están verificados y con documentación al día
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
