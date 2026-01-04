# Configuración de Supabase

Este documento te guía paso a paso para configurar Supabase en tu proyecto.

## 1. Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
GEMINI_API_KEY=tu_gemini_api_key_existente
```

Para obtener estas credenciales:
- Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
- Navega a **Settings** > **API**
- Copia la **URL** y la **anon/public key**

## 2. Ejecutar el Schema de Base de Datos

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Crea una nueva query
4. Copia y pega todo el contenido del archivo `supabase/schema.sql`
5. Ejecuta la query (botón **Run** o `Ctrl+Enter`)

Esto creará:
- ✅ Tabla `profiles` para datos de usuario
- ✅ Tabla `daily_logs` para registro diario de comidas
- ✅ Row Level Security (RLS) para proteger los datos
- ✅ Trigger automático para crear perfil al registrarse

## 3. Configurar Autenticación con Google OAuth (Opcional)

### 3.1 Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a **APIs & Services** > **Credentials**
4. Click en **Create Credentials** > **OAuth 2.0 Client ID**
5. Configura la pantalla de consentimiento si es necesario
6. Selecciona **Web application** como tipo
7. Agrega las URIs autorizadas:
   - **Authorized JavaScript origins**: `http://localhost:3000` (desarrollo)
   - **Authorized redirect URIs**: 
     - `https://tu-proyecto.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (desarrollo)
8. Guarda el **Client ID** y **Client Secret**

### 3.2 Configurar en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Authentication** > **Providers**
3. Encuentra **Google** en la lista
4. Activa el toggle
5. Pega tu **Client ID** y **Client Secret** de Google
6. Guarda los cambios

## 4. Instalar Dependencias

Ejecuta el siguiente comando para instalar la dependencia necesaria:

```bash
pnpm add @supabase/ssr
```

## 5. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 6. Probar la Autenticación

### Registro de Usuario
1. Ve a `http://localhost:3000`
2. Click en la pestaña **Registrarse**
3. Completa el formulario con:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
4. Click en **Crear cuenta**
5. Deberías ser redirigido a `/objetivos`

### Inicio de Sesión
1. Ve a `http://localhost:3000`
2. Pestaña **Iniciar sesión**
3. Ingresa tu email y contraseña
4. Click en **Iniciar sesión**
5. Deberías ser redirigido a `/dashboard`

### OAuth con Google
1. Ve a `http://localhost:3000`
2. Click en el botón **Google**
3. Completa el flujo de autenticación de Google
4. Deberías ser redirigido a `/objetivos` (primera vez) o `/dashboard`

## 7. Verificar en Supabase Dashboard

### Ver Usuarios Registrados
1. Ve a **Authentication** > **Users**
2. Deberías ver los usuarios que se han registrado

### Ver Datos en la Base de Datos
1. Ve a **Table Editor**
2. Selecciona la tabla `profiles`
3. Deberías ver los perfiles creados automáticamente

## Características Implementadas

✅ **Autenticación con Email/Password**
- Registro de nuevos usuarios
- Inicio de sesión
- Validación de formularios
- Manejo de errores

✅ **OAuth con Google**
- Inicio de sesión con cuenta de Google
- Registro automático de nuevos usuarios

✅ **Protección de Rutas**
- Middleware que protege rutas privadas
- Redirección automática según estado de autenticación

✅ **Gestión de Sesión**
- Persistencia de sesión en cookies
- Timeout de inactividad (15 minutos)
- Cierre de sesión automático por inactividad

✅ **Base de Datos**
- Esquema completo con RLS
- Creación automática de perfil al registrarse
- Políticas de seguridad para proteger datos de usuario

✅ **UI/UX**
- Estados de carga durante autenticación
- Notificaciones toast para feedback
- Validación de formularios
- Diseño responsive

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate de reiniciar el servidor después de modificar `.env.local`

### Error: "Email already registered"
- El email ya está en uso
- Intenta con otro email o inicia sesión

### Error al ejecutar el schema SQL
- Verifica que copiaste todo el contenido del archivo
- Asegúrate de que no haya errores de sintaxis
- Revisa los mensajes de error en Supabase

### OAuth con Google no funciona
- Verifica que las URIs de redirección estén correctamente configuradas
- Asegúrate de que el Client ID y Secret sean correctos
- Revisa que el provider de Google esté activado en Supabase

### Sesión no persiste
- Verifica que las cookies estén habilitadas en tu navegador
- Revisa la configuración del middleware

## Próximos Pasos

Ahora que la autenticación está configurada, puedes:

1. **Integrar con las páginas existentes**: Actualizar las páginas de onboarding y dashboard para usar datos reales de Supabase
2. **Implementar recuperación de contraseña**: Agregar funcionalidad para resetear contraseña
3. **Agregar más providers OAuth**: Facebook, GitHub, etc.
4. **Implementar verificación de email**: Requerir verificación de email al registrarse
5. **Agregar perfil de usuario**: Página para editar información del perfil
