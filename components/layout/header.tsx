'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { UserCircle, LogOut, Menu, X, Phone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        {/* Header Principal */}
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden transition-all duration-300 group-hover:scale-105">
              <Image
                src="/npLogo.jpg"
                alt="NP Automóviles"
                width={180}
                height={60}
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-base font-semibold text-white/90 transition-all duration-200 hover:text-white hover:scale-105 relative group"
            >
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/vehiculos"
              className="text-base font-semibold text-white/90 transition-all duration-200 hover:text-white hover:scale-105 relative group"
            >
              Vehículos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Acciones Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Botón de Contacto */}
            <a
              href="tel:+59898181869"
              className="inline-flex h-11 items-center gap-2 justify-center rounded-lg bg-white px-5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-white/95 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <Phone className="h-4 w-4" />
              <span>098 181 869</span>
            </a>

            {/* Icono de Admin */}
            <div className="relative" ref={dropdownRef}>
              {session ? (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center h-11 w-11 rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    aria-label="Menú de administrador"
                  >
                    <UserCircle className="h-6 w-6" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-64 rounded-lg border border-gray-200 bg-white shadow-2xl overflow-hidden">
                      <div className="px-4 py-4 border-b border-gray-200 bg-linear-to-r from-primary to-primary-dark">
                        <p className="text-sm font-semibold text-white">Administrador</p>
                        <p className="text-xs text-white/80 truncate mt-1">{session.user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          Panel Admin
                        </Link>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            signOut();
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="flex items-center justify-center h-11 w-11 rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  aria-label="Iniciar sesión como administrador"
                >
                  <UserCircle className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>

          {/* Botón Menú Mobile */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Menú"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menú Mobile */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-white/20 py-4 space-y-3 animate-in slide-in-from-top">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-base font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/vehiculos"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-base font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Vehículos
            </Link>
            <a
              href="tel:+59898181869"
              className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>098 181 869</span>
            </a>
            {!session && (
              <Link
                href="/admin/login"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <UserCircle className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            {session && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Panel Admin</span>
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-base font-semibold text-red-200 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
