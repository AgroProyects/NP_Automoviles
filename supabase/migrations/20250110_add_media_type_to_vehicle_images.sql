-- Migration: Add media_type column to vehicle_images table
-- This allows storing both images and videos for vehicles

-- Add media_type column with default 'image' for existing records
ALTER TABLE public.vehicle_images
ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) DEFAULT 'image'
CHECK (media_type IN ('image', 'video'));

-- Update storage bucket file size limit to support videos (100MB)
UPDATE storage.buckets
SET file_size_limit = 104857600
WHERE id = 'vehicle-images';

-- Comment for documentation
COMMENT ON COLUMN public.vehicle_images.media_type IS 'Type of media: image or video';
