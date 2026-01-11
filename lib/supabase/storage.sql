-- Storage configuration for vehicle images and videos

-- Create storage bucket for vehicle images (also used for videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('vehicle-images', 'vehicle-images', true, 104857600)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 104857600;
-- 104857600 bytes = 100MB limit for videos

-- Set up storage policies for vehicle images bucket
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can upload vehicle images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can update vehicle images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can delete vehicle images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'vehicle-images');

-- Note: The bucket 'vehicle-images' now supports both images and videos
-- Allowed image formats: JPG, PNG, WEBP (max 5MB)
-- Allowed video formats: MP4, WEBM, MOV (max 100MB)
