import Link from 'next/link';
import { Phone, MapPin, Shield, Award, Clock } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              NP Automóviles
            </h3>
            <p className="text-sm text-gray-600">
              Compra y venta de vehículos usados. Atención personalizada y
              financiamiento disponible.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 transition-colors hover:text-primary"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos"
                  className="text-gray-600 transition-colors hover:text-primary"
                >
                  Vehículos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Néstor Pontet</span>
                </div>
                <a
                  href="tel:+59898181869"
                  className="ml-6 transition-colors hover:text-primary"
                >
                  098 181 869
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Emanuel Carbajal</span>
                </div>
                <a
                  href="tel:+59899465511"
                  className="ml-6 transition-colors hover:text-primary"
                >
                  099 465 511
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Nueva Helvecia, Colonia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges Section */}
        <div className="mt-8 mb-8 border-t border-gray-200 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Documentación Verificada</p>
                <p className="text-xs text-gray-600">100% garantizada</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-bold text-gray-900 text-sm">+200 Clientes</p>
                <p className="text-xs text-gray-600">Satisfechos</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Respuesta Rápida</p>
                <p className="text-xs text-gray-600">En menos de 1 hora</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            &copy; {currentYear} NP Automóviles. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Desarrollado por{' '}
            <span className="font-semibold text-gray-700">Enzo Pontet</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
