import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// SEO Configuration
const siteConfig = {
  name: 'NP Automóviles',
  description: 'Compra y venta de vehículos usados en Nueva Helvecia, Colonia. Amplia selección de autos con financiamiento disponible, documentación verificada y atención personalizada. Más de 200 clientes satisfechos.',
  url: 'https://npautomoviles.com.uy',
  ogImage: '/npLogo.jpg',
  keywords: [
    'autos usados Nueva Helvecia',
    'vehículos usados Colonia',
    'compra venta autos Uruguay',
    'NP Automóviles',
    'autos con financiamiento',
    'autos usados garantía',
    'concesionaria Nueva Helvecia',
    'vehículos verificados',
    'autos segunda mano Uruguay',
    'financiamiento automotor',
    'autos baratos Uruguay',
    'comprar auto usado',
  ],
  authors: [{ name: 'Enzo Pontet', url: 'https://epontet.com' }],
  creator: 'Enzo Pontet',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Vehículos Usados en Nueva Helvecia`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.name,

  // Favicon y App Icons
  icons: {
    icon: [
      { url: '/npLogo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/npLogo.jpg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/npLogo.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
    shortcut: '/npLogo.jpg',
  },

  // Open Graph para Facebook, WhatsApp, etc.
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Vehículos Usados en Nueva Helvecia`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Vehículos de Calidad`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Vehículos Usados`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@npautomoviles',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verificación (agregar tus códigos reales cuando los tengas)
  // verification: {
  //   google: 'tu-codigo-de-google',
  //   yandex: 'tu-codigo-de-yandex',
  // },

  // Alternates
  alternates: {
    canonical: siteConfig.url,
  },

  // Category
  category: 'automotive',

  // App manifest
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#044bab' },
    { media: '(prefers-color-scheme: dark)', color: '#0e417e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoDealer',
              name: siteConfig.name,
              description: siteConfig.description,
              url: siteConfig.url,
              logo: `${siteConfig.url}/npLogo.jpg`,
              image: `${siteConfig.url}/npLogo.jpg`,
              telephone: ['+598 98 181 869', '+598 99 465 511'],
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Nueva Helvecia',
                addressRegion: 'Colonia',
                addressCountry: 'UY',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -34.2917,
                longitude: -57.2333,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '18:00',
              },
              sameAs: [],
              priceRange: '$$',
              areaServed: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: -34.2917,
                  longitude: -57.2333,
                },
                geoRadius: '100000',
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
