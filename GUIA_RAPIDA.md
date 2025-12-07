# Guía Rápida - NP Automóviles

## Inicio Rápido (5 minutos)

### 1. Configurar Supabase

```bash
# 1. Crear proyecto en https://supabase.com
# 2. Ir a SQL Editor y ejecutar lib/supabase/schema.sql
# 3. Ejecutar lib/supabase/storage.sql
# 4. Ir a Authentication > Users > Crear nuevo usuario
```

### 2. Variables de Entorno

Crear `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=resultado-de-openssl-rand-base64-32
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=vehicle-images
```

### 3. Ejecutar Proyecto

```bash
npm install
npm run dev
```

### 4. Acceder al Sistema

- **Home**: http://localhost:3000
- **Vehículos**: http://localhost:3000/vehiculos
- **Admin**: http://localhost:3000/admin/login

## Flujo de Trabajo Típico

### Agregar un vehículo nuevo

1. Login en `/admin/login`
2. Click en "Nuevo Vehículo"
3. Completar formulario:
   - Marca (seleccionar de lista)
   - Modelo
   - Año
   - Precio
   - Kilometraje
   - Combustible
   - Transmisión
   - Color (opcional)
   - Descripción (opcional)
   - Destacado (checkbox)
4. Guardar
5. En la página de edición, subir imágenes
6. Listo!

## Estructura de Archivos Clave

```
app/
├── page.tsx                    # Home con destacados
├── vehiculos/
│   ├── page.tsx               # Listado con filtros
│   └── [slug]/page.tsx        # Detalle del vehículo
├── admin/
│   ├── login/page.tsx         # Login
│   ├── page.tsx               # Dashboard
│   └── vehiculos/
│       ├── nuevo/page.tsx     # Crear vehículo
│       └── [id]/page.tsx      # Editar vehículo
└── api/
    ├── auth/[...nextauth]/    # NextAuth
    ├── vehicles/              # CRUD API
    └── upload/                # Upload imágenes

components/
├── admin/vehicle-form.tsx      # Formulario CRUD
├── vehicles/
│   ├── vehicle-card.tsx        # Card de vehículo
│   ├── vehicle-filters.tsx     # Filtros
│   └── image-carousel.tsx      # Carrusel
└── ui/                         # Componentes base

lib/
├── supabase/
│   ├── schema.sql              # DB Schema
│   ├── storage.sql             # Storage config
│   ├── client.ts               # Cliente browser
│   └── server.ts               # Cliente server
├── auth/config.ts              # NextAuth config
├── types/index.ts              # TypeScript types
└── utils.ts                    # Utilidades
```

## Personalización Rápida

### Cambiar colores

Editar `app/globals.css`:

```css
--primary: #044bab;        /* Color principal */
--primary-dark: #0e417e;   /* Color primario oscuro */
```

### Cambiar número de WhatsApp

Editar `lib/utils.ts`, línea 25:

```typescript
const phoneNumber = '5491112345678'; // Tu número
```

### Cambiar información de contacto

Editar `components/layout/footer.tsx`

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Linter
npm run lint

# Generar NEXTAUTH_SECRET
openssl rand -base64 32
```

## Resolución de Problemas Comunes

### Error de autenticación
- Verificar que el usuario existe en Supabase Auth
- Verificar NEXTAUTH_SECRET en .env.local
- Cerrar sesión y volver a intentar

### Imágenes no se suben
- Verificar que el bucket 'vehicle-images' existe
- Verificar las políticas de storage en Supabase
- Verificar SUPABASE_SERVICE_ROLE_KEY

### Vehículos no aparecen
- Verificar que las tablas existen en Supabase
- Verificar las políticas RLS
- Verificar NEXT_PUBLIC_SUPABASE_URL y ANON_KEY

## Datos de Prueba

El schema SQL incluye 5 vehículos de ejemplo. Puedes eliminarlos desde el panel admin.

## Deploy Rápido en Vercel

```bash
# 1. Push a GitHub
git add .
git commit -m "Initial commit"
git push

# 2. En Vercel:
# - Importar repositorio
# - Agregar variables de entorno
# - Deploy!
```

## Soporte

- README.md: Documentación completa
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- NextAuth: https://next-auth.js.org
