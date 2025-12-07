import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatKilometers(km: number): string {
  return new Intl.NumberFormat('es-AR').format(km) + ' km';
}

export function formatYear(year: number): string {
  return year.toString();
}

export function getWhatsAppLink(
  marca: string,
  modelo: string,
  anio: number,
  contactName?: 'nestor' | 'emanuel'
): string {
  // Néstor Pontet: 098181869, Emanuel Carbajal: 099465511
  const phoneNumbers = {
    nestor: '59898181869',
    emanuel: '59899465511',
  };

  const phoneNumber = contactName ? phoneNumbers[contactName] : phoneNumbers.nestor;
  const message = encodeURIComponent(
    `Hola! Me interesa el ${marca} ${modelo} ${anio}. ¿Podrían darme más información?`
  );
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getVehicleSlug(vehicle: {
  marca: string;
  modelo: string;
  anio: number;
  id: string;
}): string {
  return `${slugify(vehicle.marca)}-${slugify(vehicle.modelo)}-${vehicle.anio}-${vehicle.id.slice(0, 8)}`;
}

export function parseVehicleSlug(slug: string): string | null {
  const parts = slug.split('-');
  if (parts.length < 4) return null;
  // Last part should be the ID prefix
  return parts[parts.length - 1];
}
