'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

// WhatsApp Logo SVG Component
function WhatsAppLogo({ className = "h-6 w-6" }: { className?: string }) {
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

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      name: 'Néstor Pontet',
      phone: '59898181869',
      message: 'Hola, estoy interesado en consultar sobre un vehículo',
    },
    {
      name: 'Emanuel Carbajal',
      phone: '59899465511',
      message: 'Hola, estoy interesado en consultar sobre un vehículo',
    },
  ];

  const handleWhatsAppClick = (phone: string, message: string) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Contact Options Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px]">
            <div className="mb-3">
              <h3 className="font-bold text-gray-900 text-sm">
                ¿Con quién deseas hablar?
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Selecciona un contacto para iniciar la conversación
              </p>
            </div>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <button
                  key={contact.phone}
                  onClick={() => handleWhatsAppClick(contact.phone, contact.message)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-500 transition-all group"
                >
                  <div className="shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <WhatsAppLogo className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Click para chatear
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 md:right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 scale-100'
            : 'bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:scale-110 animate-pulse-subtle'
        } active:scale-95`}
        aria-label={isOpen ? 'Cerrar menú de WhatsApp' : 'Abrir menú de WhatsApp'}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <div className="relative">
            <WhatsAppLogo className="h-8 w-8 text-white" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
          </div>
        )}
      </button>
    </>
  );
}
