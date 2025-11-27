# dAIet - Asistente Inteligente de Nutrición

Una aplicación web moderna de seguimiento nutricional impulsada por IA, construida con Next.js 16, React 19, TypeScript y Tailwind CSS v4.

## 🚀 Características

- **Onboarding Completo**: Flujo guiado para configurar objetivos, datos personales y preferencias alimentarias
- **Dashboard Inteligente**: Seguimiento diario de calorías y macronutrientes con progreso visual
- **Análisis con IA**: Integración con Google Gemini para analizar alimentos manualmente ingresados
- **Recomendaciones Personalizadas**: Plan de comidas generado diariamente según perfil y objetivos
- **Progreso Visual**: Gráficos semanales de calorías y evolución de peso
- **Gestión de Alergias**: Sistema completo para evitar ingredientes no deseados

## 📁 Estructura del Proyecto

\`\`\`
app/
├── (auth)/
│   └── page.tsx                 # Landing + Login/Registro
├── objetivos/
│   └── page.tsx                 # Selección de objetivo (paso 1 onboarding)
├── actividad/
│   └── page.tsx                 # Datos personales (paso 2 onboarding)
├── alimentos/
│   └── page.tsx                 # Preferencias alimentarias (paso 3 onboarding)
├── dashboard/
│   └── page.tsx                 # Dashboard principal con comidas del día
├── progreso/
│   └── page.tsx                 # Gráficos de progreso semanal
├── preferencias/
│   └── page.tsx                 # Gestión de alergias y alimentos eliminados
├── escanear/
│   └── page.tsx                 # Escáner de códigos de barras
└── api/
    ├── gemini/
    │   ├── analyze-food/route.ts      # Analizar alimento con IA
    │   └── generate-meals/route.ts    # Generar plan de comidas
    ├── user/
    │   ├── profile/route.ts           # Obtener/actualizar perfil
    │   └── update-objetivo/route.ts   # Cambiar objetivo
    └── daily-log/
        ├── today/route.ts             # Log del día actual
        └── mark-consumed/route.ts     # Marcar alimento consumido

components/
├── progress-circle.tsx          # Círculo animado de progreso de calorías
├── macro-bar.tsx                # Barra de progreso de macronutrientes
├── meal-card.tsx                # Tarjeta de comida con checkbox
├── meal-details-modal.tsx       # Modal con desglose de ingredientes
├── add-food-modal.tsx           # Modal para agregar alimento manual
├── weekly-chart.tsx             # Gráfico semanal (calorías/peso)
└── onboarding-wizard.tsx        # Componente wizard para onboarding

lib/
├── types.ts                     # Interfaces TypeScript
└── utils/
    └── calories.ts              # Fórmulas Harris-Benedict y cálculos
\`\`\`

## 🎨 Paleta de Colores

- **Verde Principal**: `#4ADE80` (oklch(0.79 0.17 145))
- **Verde Hover**: `#22C55E` (oklch(0.69 0.19 145))
- **Verde Claro**: `#86EFAC` (oklch(0.88 0.14 145))
- **Background Oscuro**: `#0F172A` (oklch(0.14 0.01 250))
- **Cards**: `#1E293B` (oklch(0.18 0.01 250))

## 🧮 Cálculo de Calorías

### Fórmula Harris-Benedict

**Hombres:**
\`\`\`
BMR = 88.362 + (13.397 × peso_kg) + (4.799 × altura_cm) - (5.677 × edad)
\`\`\`

**Mujeres:**
\`\`\`
BMR = 447.593 + (9.247 × peso_kg) + (3.098 × altura_cm) - (4.33 × edad)
\`\`\`

### TDEE (Total Daily Energy Expenditure)
\`\`\`
TDEE = BMR × factor_actividad
\`\`\`

Factores de actividad:
- Sedentario: 1.2
- Ligera: 1.375
- Moderada: 1.55
- Alta: 1.725

### Calorías Objetivo
- **Perder Grasa**: TDEE - 500 kcal
- **Mantener**: TDEE
- **Ganar Músculo**: TDEE + 300 kcal

## 🔄 Flujo de Usuario

### Primera Vez (Onboarding)

1. **Landing/Registro**: Usuario se registra con email o Google OAuth
2. **Objetivo**: Selecciona perder grasa, mantener o ganar músculo
3. **Datos Personales**: Ingresa género, fecha nacimiento, altura, peso, actividad
4. **Preferencias**: Selecciona alimentos favoritos y alergias
5. **Dashboard**: Redirige a dashboard con plan de comidas generado

### Usuario Recurrente

1. **Login**: Inicia sesión directamente
2. **Dashboard**: Ve plan del día y progreso
3. **Acciones**:
   - Marcar comidas como consumidas
   - Agregar alimentos manualmente
   - Ver progreso semanal
   - Cambiar objetivo
   - Editar preferencias

## 🤖 Integración con IA

### Analizar Alimento Manual

\`\`\`typescript
POST /api/gemini/analyze-food
Body: { foodDescription: string }

Response: {
  nombre: string
  porcion: string
  calorias: number
  proteinas: number
  carbohidratos: number
  grasas: number
}
\`\`\`

### Generar Plan de Comidas

\`\`\`typescript
POST /api/gemini/generate-meals
Body: {
  userId: string
  objetivo: string
  caloriasDiarias: number
  alergias: string[]
  preferencias: string[]
}

Response: {
  desayuno: MealData
  almuerzo: MealData
  merienda: MealData
  cena: MealData
}
\`\`\`

## 📊 Estructura de Datos

### UserProfile
\`\`\`typescript
interface UserProfile {
  id: string
  nombre: string
  email: string
  genero: 'hombre' | 'mujer'
  fechaNacimiento: Date
  altura: number
  pesoActual: number
  nivelActividad: 'sedentario' | 'ligera' | 'moderada' | 'alta'
  objetivo: 'perder_grasa' | 'mantener' | 'ganar_musculo'
  caloriasDiarias: number
  alergias: string[]
  preferencias: string[]
}
\`\`\`

### DailyLog
\`\`\`typescript
interface DailyLog {
  id: string
  userId: string
  fecha: Date
  comidas: {
    desayuno: FoodItem[]
    almuerzo: FoodItem[]
    merienda: FoodItem[]
    cena: FoodItem[]
  }
  totales: MacroTotals
}
\`\`\`

## 🎯 Optimistic Updates

La app implementa actualizaciones optimistas para mejor UX:

\`\`\`typescript
// Usuario marca alimento como consumido
handleToggleFood(mealType, foodId) {
  // 1. Actualizar UI inmediatamente
  setFoods(prev => updateLocally(prev, foodId))
  
  // 2. Llamar API en background
  fetch('/api/daily-log/mark-consumed', {
    method: 'POST',
    body: JSON.stringify({ foodId, consumido: true })
  })
}
\`\`\`

## 🚀 Deployment

### Variables de Entorno Requeridas

\`\`\`env
GEMINI_API_KEY=tu_api_key_de_google_gemini
DATABASE_URL=tu_connection_string_de_base_de_datos
NEXTAUTH_SECRET=tu_secret_para_auth
NEXTAUTH_URL=https://tu-dominio.com
\`\`\`

### Deploy en Vercel

1. Conecta tu repositorio GitHub
2. Configura las variables de entorno
3. Deploy automático en cada push

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19.2 con Server Components
- **Styling**: Tailwind CSS v4
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **IA**: Google Gemini API
- **Formularios**: React Hook Form + Zod
- **TypeScript**: Tipado completo

## 📝 Próximas Funcionalidades

- [ ] Autenticación real con NextAuth
- [ ] Base de datos (Supabase/Neon)
- [ ] Historial de peso semanal
- [ ] Fotos de progreso
- [ ] Recetas personalizadas
- [ ] Sistema de logros y badges
- [ ] Exportar reporte PDF
- [ ] Modo offline con PWA

## 📄 Licencia

MIT License - Desarrollado para v0.app
\`\`\`

```tsx file="" isHidden
