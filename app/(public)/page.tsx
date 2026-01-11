import Link from 'next/link';
import { ArrowRight, MessageCircle, Shield, Award, Clock, Car, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Vehicle } from '@/lib/types';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
// import { TestimonialsSection } from '@/components/home/testimonials-section';

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary min-h-[500px] md:min-h-[550px] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Car Icon */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-20">
          <Car className="h-64 w-64 text-white animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">Nuevos vehículos cada semana</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Tu próximo auto está aquí
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              Amplia selección de vehículos usados en Nueva Helvecia. Financiamiento disponible y documentación garantizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/vehiculos"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Ver Vehículos
                <ArrowRight className="h-5 w-5" />
              </Link>

              <a
                href="https://wa.me/59898181869?text=Hola%2C%20estoy%20interesado%20en%20consultar%20sobre%20un%20veh%C3%ADculo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#25D366] text-white rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <WhatsAppLogo className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">200+</p>
                <p className="text-xs sm:text-sm text-white/80 mt-1">Clientes Felices</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">50+</p>
                <p className="text-xs sm:text-sm text-white/80 mt-1">Vehículos Vendidos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">100%</p>
                <p className="text-xs sm:text-sm text-white/80 mt-1">Verificados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Documentación Verificada</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Award className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">+200 Clientes Satisfechos</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Respuesta Rápida</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Vehículos Destacados
            </h2>
            <p className="text-base md:text-lg text-gray-600">
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
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 text-base font-semibold text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Ver Todos los Vehículos
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Comentado para uso futuro */}
      {/* <TestimonialsSection /> */}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para encontrar tu próximo auto?
          </h2>
          <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Contáctanos hoy y te ayudaremos a encontrar el vehículo perfecto para ti. Financiamiento disponible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/59898181869?text=Hola%2C%20estoy%20interesado%20en%20consultar%20sobre%20un%20veh%C3%ADculo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <WhatsAppLogo className="h-6 w-6" />
              Contactar por WhatsApp
            </a>
            <Link
              href="/vehiculos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Explorar Vehículos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
