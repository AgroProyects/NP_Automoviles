-- NP Automoviles Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- We'll use auth.users for authentication

-- Vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  anio INTEGER NOT NULL CHECK (anio >= 1900 AND anio <= 2100),
  precio DECIMAL(12, 2) NOT NULL CHECK (precio >= 0),
  kilometraje INTEGER NOT NULL CHECK (kilometraje >= 0),
  combustible VARCHAR(50) NOT NULL,
  transmision VARCHAR(50) NOT NULL,
  descripcion TEXT,
  color VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'disponible',
  destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Vehicle images/videos table
CREATE TABLE IF NOT EXISTS public.vehicle_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  media_type VARCHAR(10) DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_marca ON public.vehicles(marca);
CREATE INDEX IF NOT EXISTS idx_vehicles_modelo ON public.vehicles(modelo);
CREATE INDEX IF NOT EXISTS idx_vehicles_anio ON public.vehicles(anio);
CREATE INDEX IF NOT EXISTS idx_vehicles_precio ON public.vehicles(precio);
CREATE INDEX IF NOT EXISTS idx_vehicles_destacado ON public.vehicles(destacado);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON public.vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON public.vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_is_primary ON public.vehicle_images(is_primary);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

-- Public read access for vehicles
CREATE POLICY "Public vehicles are viewable by everyone"
  ON public.vehicles FOR SELECT
  USING (true);

-- Public read access for vehicle images
CREATE POLICY "Public vehicle images are viewable by everyone"
  ON public.vehicle_images FOR SELECT
  USING (true);

-- Authenticated users can insert, update, delete vehicles
CREATE POLICY "Authenticated users can insert vehicles"
  ON public.vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicles"
  ON public.vehicles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vehicles"
  ON public.vehicles FOR DELETE
  TO authenticated
  USING (true);

-- Authenticated users can manage vehicle images
CREATE POLICY "Authenticated users can insert vehicle images"
  ON public.vehicle_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicle images"
  ON public.vehicle_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vehicle images"
  ON public.vehicle_images FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data (optional)
INSERT INTO public.vehicles (marca, modelo, anio, precio, kilometraje, combustible, transmision, descripcion, color, destacado) VALUES
  ('Toyota', 'Corolla', 2022, 18500000, 25000, 'Nafta', 'Automática', 'Toyota Corolla 2022 en excelente estado. Único dueño, service oficial completo.', 'Blanco', true),
  ('Ford', 'Ranger', 2021, 35000000, 45000, 'Diesel', 'Manual', 'Ford Ranger XLT 4x4. Ideal para trabajo y aventura.', 'Negro', true),
  ('Volkswagen', 'Polo', 2023, 16500000, 12000, 'Nafta', 'Manual', 'VW Polo Trendline 2023. Como nuevo, pocos kilómetros.', 'Gris', false),
  ('Chevrolet', 'Onix', 2022, 14500000, 30000, 'Nafta', 'Automática', 'Chevrolet Onix LTZ automático. Muy económico.', 'Rojo', false),
  ('Honda', 'Civic', 2021, 22000000, 35000, 'Nafta', 'Automática', 'Honda Civic EXL. Equipamiento completo, impecable.', 'Azul', true);
