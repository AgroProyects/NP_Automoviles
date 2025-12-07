export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  kilometraje: number;
  combustible: string;
  transmision: string;
  descripcion?: string;
  color?: string;
  estado?: string;
  destacado: boolean;
  created_at: string;
  updated_at: string;
  images?: VehicleImage[];
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface VehicleFormData {
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  kilometraje: number;
  combustible: string;
  transmision: string;
  descripcion?: string;
  color?: string;
  destacado: boolean;
}

export interface VehicleFilters {
  marca?: string;
  modelo?: string;
  anioMin?: number;
  anioMax?: number;
  precioMin?: number;
  precioMax?: number;
  combustible?: string;
  transmision?: string;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const COMBUSTIBLE_OPTIONS = [
  'Nafta',
  'Diesel',
  'GNC',
  'Híbrido',
  'Eléctrico',
] as const;

export const TRANSMISION_OPTIONS = [
  'Manual',
  'Automática',
  'Semiautomática',
] as const;

export const MARCAS_POPULARES = [
  'Abarth',
  'Alfa Romeo',
  'Audi',
  'BMW',
  'Chevrolet',
  'Chrysler',
  'Citroën',
  'Dacia',
  'Dodge',
  'Ferrari',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Infiniti',
  'Isuzu',
  'Jaguar',
  'Jeep',
  'Kia',
  'Lada',
  'Lamborghini',
  'Land Rover',
  'Lexus',
  'Mahindra',
  'Maserati',
  'Mazda',
  'McLaren',
  'Mercedes-Benz',
  'Mini',
  'Mitsubishi',
  'Nissan',
  'Opel',
  'Peugeot',
  'Porsche',
  'Ram',
  'Renault',
  'Rolls-Royce',
  'Seat',
  'Skoda',
  'Smart',
  'Subaru',
  'Suzuki',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
] as const;

export type Combustible = typeof COMBUSTIBLE_OPTIONS[number];
export type Transmision = typeof TRANSMISION_OPTIONS[number];
