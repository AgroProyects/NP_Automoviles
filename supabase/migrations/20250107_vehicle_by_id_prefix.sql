-- Function to find a vehicle by ID prefix
-- This allows us to search UUIDs using text pattern matching
CREATE OR REPLACE FUNCTION get_vehicle_by_id_prefix(id_prefix TEXT)
RETURNS TABLE (
  id UUID,
  marca TEXT,
  modelo TEXT,
  anio INTEGER,
  precio DECIMAL,
  kilometraje INTEGER,
  combustible TEXT,
  transmision TEXT,
  descripcion TEXT,
  color TEXT,
  destacado BOOLEAN,
  disponible BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.marca,
    v.modelo,
    v.anio,
    v.precio,
    v.kilometraje,
    v.combustible,
    v.transmision,
    v.descripcion,
    v.color,
    v.destacado,
    v.disponible,
    v.created_at,
    v.updated_at
  FROM vehicles v
  WHERE v.id::text LIKE id_prefix || '%'
  LIMIT 1;
END;
$$;
