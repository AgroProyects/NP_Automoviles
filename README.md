# NP Automóviles - Sistema de Exhibición de Vehículos

Sistema web completo para exhibir vehículos construido con Next.js 14, Supabase, NextAuth y TailwindCSS.

## Características

### Parte Pública
- **Home**: Página principal con sección de vehículos destacados
- **Listado de Vehículos**: Grid con filtros avanzados (marca, modelo, año, precio, combustible, transmisión)
- **Detalle del Vehículo**: Carrusel de imágenes, información completa y botón de WhatsApp

### Panel de Administración
- **Autenticación**: Login seguro con NextAuth
- **CRUD de Vehículos**: Crear, editar y eliminar vehículos
- **Gestión de Imágenes**: Subida múltiple de imágenes por vehículo a Supabase Storage
- **Tabla de Gestión**: Vista tabular de todos los vehículos

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Base de Datos**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Autenticación**: NextAuth.js
- **Estilos**: TailwindCSS 4
- **TypeScript**: Tipado estricto
- **Componentes UI**: Inspirados en shadcn/ui

## Estructura del Proyecto

```
np_automoviles/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/      # NextAuth API routes
│   │   ├── vehicles/                # CRUD de vehículos
│   │   └── upload/                  # Upload de imágenes
│   ├── admin/
│   │   ├── login/                   # Página de login
│   │   ├── vehiculos/               # CRUD UI
│   │   └── page.tsx                 # Dashboard admin
│   ├── vehiculos/
│   │   ├── [slug]/                  # Detalle del vehículo
│   │   └── page.tsx                 # Listado con filtros
│   ├── layout.tsx                   # Layout principal
│   └── page.tsx                     # Home page
├── components/
│   ├── admin/                       # Componentes de admin
│   ├── layout/                      # Header y Footer
│   ├── providers/                   # Providers (SessionProvider)
│   ├── ui/                          # Componentes UI base
│   └── vehicles/                    # Componentes de vehículos
├── lib/
│   ├── auth/                        # Configuración NextAuth
│   ├── supabase/                    # Clientes Supabase
│   ├── types/                       # Tipos TypeScript
│   └── utils.ts                     # Utilidades
├── types/                           # Type definitions
└── public/
    └── npLogo.jpg                   # Logo de la empresa
```

## Configuración e Instalación

### 1. Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase (gratuita)
- npm o pnpm

### 2. Clonar e Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva organización y proyecto
3. Guarda la URL y las claves (anon key y service_role key)

#### 3.2 Ejecutar el Schema SQL
1. En el dashboard de Supabase, ve a "SQL Editor"
2. Copia y ejecuta el contenido de `lib/supabase/schema.sql`
3. Verifica que las tablas `vehicles` y `vehicle_images` se hayan creado

#### 3.3 Configurar Storage
1. En Supabase, ve a "Storage"
2. Ejecuta el contenido de `lib/supabase/storage.sql` en el SQL Editor
3. Verifica que el bucket `vehicle-images` se haya creado con las políticas correctas

#### 3.4 Crear Usuario Admin
1. En Supabase, ve a "Authentication" > "Users"
2. Crea un nuevo usuario con email y contraseña
3. Guarda estas credenciales para usar en el login del admin

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera_un_secret_con_openssl_rand_base64_32

# Storage Configuration
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=vehicle-images
```

#### Generar NEXTAUTH_SECRET

En tu terminal, ejecuta:

```bash
openssl rand -base64 32
```

Copia el resultado y úsalo como valor de `NEXTAUTH_SECRET`.

### 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Uso del Sistema

### Parte Pública

1. **Home** (`/`): Página principal con vehículos destacados
2. **Listado** (`/vehiculos`): Todos los vehículos con filtros
3. **Detalle** (`/vehiculos/[slug]`): Información completa del vehículo

### Panel de Administración

1. **Login** (`/admin/login`): Acceder con las credenciales de Supabase Auth
2. **Dashboard** (`/admin`): Ver todos los vehículos en tabla
3. **Crear Vehículo** (`/admin/vehiculos/nuevo`): Agregar nuevo vehículo
4. **Editar Vehículo** (`/admin/vehiculos/[id]`): Modificar vehículo existente y gestionar imágenes

### Flujo de Trabajo para Agregar un Vehículo

1. Acceder a `/admin/login` con tus credenciales
2. Hacer clic en "Nuevo Vehículo"
3. Completar el formulario con los datos del vehículo
4. Hacer clic en "Guardar Vehículo"
5. En la página de edición que aparece, subir las imágenes del vehículo
6. La primera imagen subida será la imagen principal automáticamente

## Personalización

### Colores

Los colores de la marca están definidos en `app/globals.css`:

```css
--primary: #044bab;
--primary-dark: #0e417e;
--light: #c9e7f5;
--medium: #5b91b8;
--medium-blue: #6eb4d3;
--accent-blue: #44a0dc;
--bright-blue: #3495ca;
--accent: #849cc4;
```

### WhatsApp

Configura el número de WhatsApp en `lib/utils.ts`, función `getWhatsAppLink`:

```typescript
const phoneNumber = '5491112345678'; // Reemplaza con tu número
```

### Información de Contacto

Actualiza el footer en `components/layout/footer.tsx` con tu información de contacto.

## Deploy en Vercel

1. Sube tu código a GitHub
2. Conecta tu repositorio en [vercel.com](https://vercel.com)
3. Configura las variables de entorno en Vercel:
   - Copia todas las variables de `.env.local`
   - Cambia `NEXTAUTH_URL` a tu dominio de producción
4. Haz deploy

## Scripts Disponibles

- `npm run dev`: Iniciar servidor de desarrollo
- `npm run build`: Construir para producción
- `npm start`: Iniciar servidor de producción
- `npm run lint`: Ejecutar linter

## Características Técnicas

### Optimizaciones

- **Server Components**: Maximiza el uso de React Server Components
- **Image Optimization**: Usa `next/image` para optimización automática
- **Streaming**: SSR con streaming para carga rápida
- **Static Generation**: Páginas estáticas cuando es posible

### Seguridad

- **Row Level Security**: Políticas RLS en Supabase
- **Autenticación**: NextAuth con credenciales seguras
- **Middleware**: Protección de rutas admin
- **Validación**: Validación de datos en cliente y servidor

### SEO

- **Metadata**: Metadata optimizada en cada página
- **Semantic HTML**: Estructura HTML semántica
- **URLs Amigables**: Slugs optimizados para SEO

## Soporte

Para problemas o preguntas:
1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Consulta la documentación de [Supabase](https://supabase.com/docs)
3. Revisa la documentación de [NextAuth](https://next-auth.js.org)

## Licencia

Este proyecto está diseñado para uso interno de NP Automóviles.
