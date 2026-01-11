import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://npautomoviles.com.uy';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/vehiculos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Obtener todos los vehículos para generar URLs dinámicas
  try {
    const supabase = await createClient();
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('slug, updated_at, created_at')
      .order('created_at', { ascending: false });

    const vehiclePages: MetadataRoute.Sitemap = (vehicles || []).map((vehicle) => ({
      url: `${baseUrl}/vehiculos/${vehicle.slug}`,
      lastModified: new Date(vehicle.updated_at || vehicle.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...vehiclePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
