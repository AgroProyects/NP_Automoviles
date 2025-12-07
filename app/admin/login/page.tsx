'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LogIn, Shield, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel Izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#044bab] via-[#0e417e] to-[#044bab] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          <div className="mb-8">
            <Image
              src="/npLogo.jpg"
              alt="NP Automóviles"
              width={200}
              height={80}
              className="w-auto h-16 drop-shadow-2xl"
            />
          </div>
          <Shield className="w-24 h-24 mb-8 text-[#c9e7f5] drop-shadow-lg" />
          <h1 className="text-4xl font-bold mb-4 text-center">
            Panel de Administración
          </h1>
          <p className="text-lg text-[#c9e7f5] text-center max-w-md">
            Gestiona tu catálogo de vehículos de forma segura y eficiente
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#44a0dc]">100%</div>
              <div className="text-sm text-[#c9e7f5]">Seguro</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#44a0dc]">24/7</div>
              <div className="text-sm text-[#c9e7f5]">Disponible</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#44a0dc]">Fast</div>
              <div className="text-sm text-[#c9e7f5]">Rápido</div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden mb-8 text-center">
            <Image
              src="/npLogo.jpg"
              alt="NP Automóviles"
              width={150}
              height={60}
              className="mx-auto h-12 w-auto"
            />
          </div>

          {/* Card del formulario */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#044bab] to-[#3495ca] px-8 py-6">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-8 h-8 text-white mr-3" />
                <h2 className="text-2xl font-bold text-white">
                  Acceso Seguro
                </h2>
              </div>
              <p className="text-center text-[#c9e7f5] text-sm">
                Ingresa tus credenciales de administrador
              </p>
            </div>

            {/* Formulario */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mensaje de error */}
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Campo Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 font-semibold flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2 text-[#044bab]" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@npautomoviles.com"
                    className="h-12 border-gray-300 focus:border-[#044bab] focus:ring-[#044bab] text-gray-900 placeholder:text-gray-400"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-semibold flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-2 text-[#044bab]" />
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 border-gray-300 focus:border-[#044bab] focus:ring-[#044bab] text-gray-900"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Botón Submit */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#044bab] to-[#3495ca] hover:from-[#0e417e] hover:to-[#044bab] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </form>

              {/* Footer informativo */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500">
                  Acceso restringido solo para personal autorizado
                </p>
                <div className="flex items-center justify-center mt-2 text-xs text-gray-400">
                  <Lock className="w-3 h-3 mr-1" />
                  Conexión segura y cifrada
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Problemas para acceder?{' '}
              <a href="mailto:soporte@npautomoviles.com" className="text-[#044bab] hover:text-[#0e417e] font-semibold">
                Contactar soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
