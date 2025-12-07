# 🚀 Configuración de Supabase para NP Automóviles

Sigue estos pasos para configurar Supabase y tener el sistema funcionando en minutos.

## 📋 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratis si no tienes una
3. Haz clic en "New Project"
4. Completa:
   - **Name**: NP Automóviles
   - **Database Password**: Guarda esta contraseña (la necesitarás)
   - **Region**: Selecciona la más cercana a tu ubicación
5. Haz clic en "Create new project" (tarda ~2 minutos)

## 🗄️ Paso 2: Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor** (en el menú lateral izquierdo)
2. Crea una nueva query
3. Copia TODO el contenido del archivo `lib/supabase/schema.sql`
4. Pégalo en el editor SQL
5. Haz clic en **Run** (botón inferior derecho)
6. ✅ Deberías ver "Success. No rows returned"

### Ejecutar Migraciones Adicionales

7. Crea otra nueva query en SQL Editor
8. Copia el contenido del archivo `supabase/migrations/20250107_vehicle_by_id_prefix.sql`
9. Pégalo y haz clic en **Run**
10. ✅ Deberías ver "Success. No rows returned"

## 📁 Paso 3: Configurar Storage (Imágenes)

1. Ve a **SQL Editor** nuevamente
2. Crea una nueva query
3. Copia TODO el contenido del archivo `lib/supabase/storage.sql`
4. Pégalo en el editor SQL
5. Haz clic en **Run**
6. ✅ Deberías ver "Success"

## 🔑 Paso 4: Crear Usuario Administrador

1. Ve a **Authentication** → **Users** (en el menú lateral)
2. Haz clic en "Add user" → "Create new user"
3. Completa:
   - **Email**: admin@npautomoviles.com (o el que prefieras)
   - **Password**: Una contraseña segura
   - **Auto Confirm User**: ✅ Actívalo
4. Haz clic en "Create user"

## 🔐 Paso 5: Obtener las Credenciales

1. Ve a **Project Settings** → **API** (icono de engranaje en el menú lateral)
2. Copia estas 3 credenciales:
   - **Project URL** (ej: https://xxxxx.supabase.co)
   - **anon public** key
   - **service_role** key (haz clic en "Reveal" para verla)

## ⚙️ Paso 6: Configurar Variables de Entorno

1. Abre tu archivo `.env.local` (si no existe, copia `.env.example` a `.env.local`)
2. Completa con tus credenciales:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co  # Tu Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=  # Genera uno con: openssl rand -base64 32

# Storage Configuration
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=vehicle-images
```

3. Para generar el `NEXTAUTH_SECRET`, ejecuta en tu terminal:
```bash
openssl rand -base64 32
```

## 🎯 Paso 7: Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## ✅ Paso 8: Probar el Sistema

1. Abre tu navegador en: http://localhost:3000
2. **Probar el login admin**:
   - Haz clic en el icono de usuario (esquina superior derecha)
   - Ingresa el email y password del admin que creaste
   - Deberías ver el Panel de Administración

3. **Probar el CRUD**:
   - En el panel admin, haz clic en "Nuevo Vehículo"
   - Completa el formulario
   - Sube imágenes
   - Guarda el vehículo
   - Verifica que aparezca en la lista pública

## 🔍 Verificación de Datos de Ejemplo

Si ejecutaste el `schema.sql` completo, deberías tener 5 vehículos de ejemplo:
- Toyota Corolla 2022
- Ford Ranger 2021
- Volkswagen Polo 2023
- Chevrolet Onix 2022
- Honda Civic 2021

Puedes verlos en:
- Home: http://localhost:3000 (destacados)
- Listado: http://localhost:3000/vehiculos

## 🆘 Solución de Problemas

### Error: "Invalid JWT"
- Verifica que el `NEXTAUTH_SECRET` esté configurado
- Regenera el secret con `openssl rand -base64 32`

### Error: "Database connection failed"
- Verifica que la `NEXT_PUBLIC_SUPABASE_URL` sea correcta
- Verifica que las keys no tengan espacios al principio o final

### No puedo hacer login
- Verifica que creaste el usuario en Supabase Authentication
- Verifica que el usuario esté confirmado (Auto Confirm User)
- Revisa la consola del navegador para ver errores específicos

### Las imágenes no se suben
- Verifica que ejecutaste el `storage.sql`
- Ve a Storage en Supabase y confirma que existe el bucket "vehicle-images"
- Verifica que las políticas de storage estén activas

## 📞 Contacto

Si tienes problemas, revisa:
1. Los logs de la consola del navegador (F12)
2. Los logs del servidor en la terminal
3. La documentación de Supabase: https://supabase.com/docs

---

**¡Listo!** Tu sistema NP Automóviles debería estar funcionando perfectamente. 🎉
