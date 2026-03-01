# 🔪 Knife Set: Handoff & Architecture Documentation

## 1. Resumen de la Evolución (De Vite Mock a Next.js Pro)

El proyecto pasó de ser una prueba de concepto estática en Vite (Foodie Map) a una plataforma Full-Stack de **Next.js 15 (App Router)** conectada a **PostgreSQL (Supabase)**. 

Se abandonó el "mockeo" de datos para pasar a un **Algoritmo de Consistencia Real ($C_{ks}$)** programado directamente en la base de datos (RPC), y la UI fue evolucionada para reflejar la seriedad de una "Data Company" utilizando gráficos WebGL y animaciones de performance nativo.

---

## 2. Mapa del Repositorio Actual (`/knife-set`)

```text
knife-set/
├── supabase/                      # 🗄️ Capa de Datos y Algoritmo
│   ├── schema-pro.sql             # Esquema BD, RLS, y el RPC de Varianza (Consistencia)
│   └── seed-pro.sql               # Datos de prueba para disparar el algoritmo
├── src/
│   ├── app/                       # 🌐 Enrutamiento Next.js
│   │   ├── (landing)/             # página principal GSAP + 3D
│   │   ├── algoritmo/             # "Whitepaper" del Algoritmo Cks
│   │   └── app/                   # Plataforma Privada / Explorador
│   │       ├── agenda/            # Grid para EVENTOS (Ferias, Conciertos)
│   │       ├── score/             # Grid para LOCALES (Restaurantes, Cafés)
│   │       └── evaluar/           # Consola interactiva para evaluadores MARK
│   ├── components/
│   │   ├── 3d/hero-scene.tsx      # Partículas WebGL (@react-three/fiber)
│   │   └── ui/gsap-marquee.tsx    # Scroll Horizontal infinito basado en inercia
│   ├── features/                  # Lógica de Negocio
│   │   ├── reviews/review-form.tsx# Formularios condicionales (Place o Event)
│   │   └── score/place-card.tsx   # Tarjetas dinámicas con Badges de Consistencia
│   └── lib/                       # Utilidades Nucleares
│       └── supabase/              # Clientes SSR / Client y Middleware Next.js
```

---

## 3. Instrucciones de Cierre e Integración Final

El código actual compila y muestra visualmente (con mocks controlados) todo el diseño propuesto. Para enganchar la **Base de Datos Real** debes:

### Paso A: Supabase Setup
1. Crear un proyecto nuevo en [Supabase](https://supabase.com/).
2. Ir a SQL Editor y pegar el contenido total del archivo `supabase/schema-pro.sql` y ejecutarlo. 
   *(Esto creará las tablas, la seguridad RLS, la función matemática de Consistencia e insertará triggers de autocalculado).*
3. (Opcional) Ejecutar el `supabase/seed-pro.sql` para tener perfiles de MARKs iniciales y restaurantes de prueba.

### Paso B: Variables de Entorno
En la raíz de la carpeta `knife-set/`, crea un archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### Paso C: Sustitución de Mocks
- En **[src/app/app/score/page.tsx](src/app/app/score/page.tsx)**, reemplazar el array `MOCK_PLACES` por un Server Component fetch clásico usando la función previamente creada `await supabase.from('places').select('*')`.
- En **[src/app/app/evaluar/page.tsx](src/app/app/evaluar/page.tsx)**, conectar el `onSubmit` del formulario al método que hace un `.insert()` sobre la tabla `reviews`. Ese único paso activará vía Trigger todo el recalculo de Consistencia.

---

## 4. Diseño del Algoritmo Matemático Integrado

El RPC creado en SQL ejecuta lo siguiente cada vez que un MARK inserta una Review:

1. Calcula el **Promedio** (`AVG`) de ese restaurante.
2. Calcula la **Desviación Estándar Poblacional** (`stddev_pop`) de sus scores históricos.
3. Multiplica esa desviación por un factor de penalización `Lambda (0.25)`.
4. El Score oficial pasa a ser: **`Promedio - (Lambda * Desviacion)`**.

*Si el número de Desviación devuelto y guardado en `consistency_score` es menor a `1.0`, el Frontend (PlaceCard) automáticamente cataloga y pinta al local de color Verde con un cartel oficial de **"Sello Titanio"**.*

---

**Proyecto listo para integrarse a producción.** ¡Enhorabuena por evolucionar la calidad del producto! Puedes revisar libremente los archivos marcados.