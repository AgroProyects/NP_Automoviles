'use client';

import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  vehicle: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Carlos Rodríguez",
    location: "Nueva Helvecia",
    text: "Excelente atención y vehículo tal cual lo mostraban. Muy recomendable.",
    rating: 5,
    vehicle: "Toyota Corolla 2018"
  },
  {
    name: "María González",
    location: "Colonia",
    text: "Néstor me ayudó a encontrar el auto perfecto para mi familia. Muy profesionales.",
    rating: 5,
    vehicle: "Honda CR-V 2020"
  },
  {
    name: "Juan Pérez",
    location: "Rosario",
    text: "Financiamiento accesible y trámites rápidos. Emanuel estuvo siempre disponible.",
    rating: 5,
    vehicle: "Chevrolet Cruze 2019"
  }
];

export function TestimonialsSection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Más de 200 clientes satisfechos en toda la región
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
                <p className="text-xs text-primary font-semibold mt-1">
                  Compró: {testimonial.vehicle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
