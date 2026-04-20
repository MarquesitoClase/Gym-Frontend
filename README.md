# 🏋️ Titan Gym — Frontend

[English README](./README.en.md)

![Estado](https://img.shields.io/badge/Estado-Activo-2563EB)
![Idioma](https://img.shields.io/badge/Idioma-Espa%C3%B1ol-E11D48)
![Frontend](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)

Panel de administración interno para la gestión operativa de Titan Gym. Orientado a recepción y coordinación, construido con React 19 y preparado para integrarse con un backend Spring Boot.

---

## 🧭 Índice

![Secciones](https://img.shields.io/badge/Secciones-12-0F172A)
![Navegaci%C3%B3n](https://img.shields.io/badge/Navegaci%C3%B3n-Interna-14B8A6)

1. Stack tecnológico
2. Puesta en marcha
3. Variables de entorno
4. Scripts disponibles
5. Arquitectura del proyecto
6. Rutas de la aplicación
7. Autenticación
8. Módulos funcionales (features)
9. Servicios de API
10. Componentes UI reutilizables
11. Utilidades
12. Estilos

---

## 🧱 Stack tecnológico

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Router](https://img.shields.io/badge/Router-React_Router_7-CA4245?logo=reactrouter&logoColor=white)

| Capa | Tecnología |
| --- | --- |
| Framework UI | React 19.2 |
| Enrutamiento | React Router 7.14 |
| Bundler | Vite 8.0 |
| Estilos | CSS vanilla modular |
| Linting | ESLint 9 + plugins React |
| HTTP | Fetch nativo con wrapper propio |

No hay gestor de estado global (Redux, Zustand, etc.). Todo el estado vive en hooks locales de cada feature.

---

## 🚀 Puesta en marcha

![Node](https://img.shields.io/badge/Node-Requerido-339933?logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-Install%20%26%20Run-CB3837?logo=npm&logoColor=white)
![Localhost](https://img.shields.io/badge/Dev-localhost%3A5173-0EA5E9)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el fichero de entorno
echo VITE_API_BASE_URL=http://localhost:8080/api > .env.local

# 3. Arrancar en desarrollo
npm run dev
```

La aplicación arranca en `http://localhost:5173` por defecto.

---

## 🔐 Variables de entorno

![Vite](https://img.shields.io/badge/VITE_API_BASE_URL-Configurable-646CFF?logo=vite&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?logo=springboot&logoColor=white)

| Variable | Requerida | Descripción | Valor por defecto |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | URL base del backend Spring Boot | `http://localhost:8080/api` |

---

## 🛠️ Scripts disponibles

![Dev](https://img.shields.io/badge/Script-dev-2563EB)
![Build](https://img.shields.io/badge/Script-build-16A34A)
![Lint](https://img.shields.io/badge/Script-lint-F59E0B)

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compilación de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Análisis estático con ESLint |

---

## 🏗️ Arquitectura del proyecto

![Arquitectura](https://img.shields.io/badge/Arquitectura-Feature--based-0F172A)
![UI](https://img.shields.io/badge/UI-Reutilizable-7C3AED)
![Servicios](https://img.shields.io/badge/Servicios-API%20Layer-0891B2)

```text
src/
├── app/                    # Punto de entrada (App.jsx)
├── auth/                   # Contexto y guardia de autenticación
├── layout/                 # Shell global, sidebar y topbar
├── router/                 # Definición de rutas y AppRouter
├── pages/                  # Componentes de página (uno por ruta)
├── features/               # Bloques funcionales por dominio
│   ├── activities/
│   ├── dashboard/
│   ├── enrollments/
│   ├── teachers/
│   └── users/
├── components/
│   └── ui/                 # Componentes reutilizables sin lógica de negocio
├── services/
│   ├── endpoints/          # Un servicio por entidad de API
│   ├── http/               # Cliente HTTP, ApiError, helpers
│   └── mappers/            # Transformaciones DTO → modelo de vista
├── utils/                  # Funciones puras compartidas
└── styles/                 # Tema global y estilos de aplicación
```

**Patrón general:** cada feature es autónoma — contiene su propio componente principal, lógica de carga, y si es necesario estilos propios. Los servicios y componentes UI se comparten horizontalmente.

---

## 🗺️ Rutas de la aplicación

![Routing](https://img.shields.io/badge/Routing-React_Router-CA4245?logo=reactrouter&logoColor=white)
![Protecci%C3%B3n](https://img.shields.io/badge/Rutas-Protegidas-DC2626)

| Ruta | Página | Protegida | Descripción |
| --- | --- | --- | --- |
| `/login` | `LoginPage` | No | Acceso al panel |
| `/` | `DashboardPage` | Sí | Panel principal operativo |
| `/actividades` | `ActivitiesPage` | Sí | Catálogo de clases y talleres |
| `/usuarios` | `UsersPage` | Sí | Gestión de socios |
| `/profesores` | `TeachersPage` | Sí | Gestión de monitores |
| `/inscripciones` | `EnrollmentsPage` | Sí | Inscripción rápida de socios |
| `/*` | `NotFoundPage` | Sí | Catch-all 404 |

Las rutas protegidas redirigen a `/login` si no hay sesión activa (`ProtectedRoute`).

---

## 🔐 Autenticación

![Auth](https://img.shields.io/badge/Auth-Local-F97316)
![Storage](https://img.shields.io/badge/Persistencia-localStorage-0EA5E9)

Autenticación local sin backend. Las credenciales están hardcodeadas en `src/auth/AuthContext.jsx`.

| Campo | Valor |
| --- | --- |
| Email | `admin@titangym.com` |
| Contraseña | `Admin1234` |
| Nombre | Admin Titan |
| Rol | Administrador principal |

La sesión se persiste en `localStorage` bajo la clave `titan_gym_auth`. El hook `useAuth()` expone `{ isAuthenticated, admin, login, logout }` a cualquier componente.

---

## 🧩 Módulos funcionales (features)

![Features](https://img.shields.io/badge/Features-5-1D4ED8)
![Dominios](https://img.shields.io/badge/Dominios-Dashboard%20%7C%20CRUD%20%7C%20Enrollments-334155)

### 📊 Dashboard (`/`)

![Vista](https://img.shields.io/badge/Vista-Operativa-2563EB)
![Resumen](https://img.shields.io/badge/Datos-M%C3%A9tricas%20y%20agenda-14B8A6)

Panel de bienvenida con visión operativa en tiempo real.

- **Métricas principales:** socios activos, clases activas, ingresos previstos con barra de progreso hacia objetivo (50 000 €).
- **Próximas actividades:** hasta 5 clases futuras ordenadas por fecha, con monitor, hora, inscritos y precio.
- **Quick actions:** accesos directos a las secciones principales.
- **Último socio registrado:** avatar, nombre y estado.

Carga datos en paralelo desde `usersService`, `teachersService` y `activitiesService`.

---

### 🏃 Actividades (`/actividades`)

![Cat%C3%A1logo](https://img.shields.io/badge/Secci%C3%B3n-Cat%C3%A1logo-7C3AED)
![Modal](https://img.shields.io/badge/Flujo-Crear%20y%20editar-0EA5E9)

Catálogo visual de clases y talleres futuros.

**Vista catálogo (`ActivityCatalog`):**

- Grid con las 4 primeras actividades en la zona superior y 2 adicionales en la inferior.
- Las actividades con el mismo título y monitor se agrupan en una sola card mostrando todas sus sesiones como chips de fecha.
- Insights del catálogo: actividad premium, ingresos previstos, número de monitores con clases.

**Tarjeta de actividad (`ActivityCard`):**

- Imagen de portada automática por tipo de actividad (yoga, pilates, spinning, hiit, boxing, strength).
- Precio, monitor asignado y lista de sesiones con fecha y conteo de inscritos por sesión.
- Botón de edición que abre el modal.

**Formulario (`ActivityFormModal`):**

- Creación y edición de actividades.
- Generador automático de sesiones: semanal o 2 veces por semana a partir de una fecha inicial.
- Posibilidad de añadir, editar y eliminar fechas adicionales manualmente.
- Un envío puede crear múltiples sesiones a la vez.
- Validaciones: título y monitor obligatorios, fecha mínima = ahora.

---

### 👥 Usuarios (`/usuarios`)

![Socios](https://img.shields.io/badge/Entidad-Socios-2563EB)
![Tabla](https://img.shields.io/badge/UI-Tabla%20paginada-14B8A6)

Gestión completa del padrón de socios.

**Tabla (`UsersTableSection`):**

- Paginación de 4 por página.
- Métricas de resumen: total, activos e inactivos.
- Columnas: foto, nombre completo, DNI, año de alta, estado activo/inactivo, acciones.
- Toggle rápido de estado activo/inactivo sin abrir el modal.

**Formulario (`UserFormModal`):**

- Campos: nombre, apellidos, DNI, año de alta, foto, estado activo.
- Vista previa de imagen antes de guardar.
- **Pestaña de inscripciones** (solo en modo edición):

  - Lista de actividades en las que el socio está inscrito.
  - Opción de desapuntar de una actividad.
  - Opción de inscribir en una nueva actividad desde el propio modal.
- Eliminación de socio con confirmación.

---

### 🏋️‍♂️ Monitores (`/profesores`)

![Equipo](https://img.shields.io/badge/Entidad-Monitores-F97316)
![Asignaciones](https://img.shields.io/badge/Datos-Actividades%20asignadas-0EA5E9)

Gestión del equipo de monitores.

**Tabla (`TeachersTableSection`):**

- Paginación de 4 por página.
- Métricas: total plantilla, clases activas, tasa de retención.
- Columnas: foto, nombre completo, DNI, año de contratación, actividades asignadas (chips), acción editar.

**Formulario (`TeacherFormModal`):**

- Campos: nombre, apellidos, DNI, año de contratación, foto, estado activo.
- Vista previa de imagen.
- Eliminación de monitor con confirmación.

---

### 📝 Inscripciones (`/inscripciones`)

![Flujo](https://img.shields.io/badge/Proceso-3%20pasos-2563EB)
![Validaciones](https://img.shields.io/badge/Reglas-Frontend%20%2B%20Backend-DC2626)

Flujo guiado de 3 pasos para inscribir un socio en una actividad.

```text
Paso 1 — Elige socio   →   Paso 2 — Elige actividad   →   Paso 3 — Confirma
```

**Paso 1:** buscador por nombre o DNI, listado con avatar, nombre y estado del socio.

**Paso 2:** listado de actividades futuras disponibles. Las ya inscritas aparecen marcadas y no son seleccionables.

**Paso 3:** barra de confirmación con resumen (socio, actividad, fecha, precio) y botón de confirmar.

**Validaciones antes de enviar:**

- Socio debe estar activo.
- Socio no puede estar ya inscrito en esa actividad.
- Socio no puede superar 3 actividades futuras simultáneas.
- La actividad debe tener monitor asignado (el backend rechaza `teacherId` vacío).

Tras confirmar, el conteo de inscripciones se refresca y se puede inscribir en otra actividad sin reiniciar el flujo.

---

## 🌐 Servicios de API

![HTTP](https://img.shields.io/badge/HTTP-Fetch-0EA5E9)
![REST](https://img.shields.io/badge/API-REST-2563EB)
![DTO](https://img.shields.io/badge/Mapeo-DTO%20a%20vista-7C3AED)

Todos los servicios viven en `src/services/endpoints/` y usan el cliente HTTP centralizado.

### 🔌 Cliente HTTP (`src/services/http/apiClient.js`)

![Wrapper](https://img.shields.io/badge/Wrapper-apiClient-0891B2)
![FormData](https://img.shields.io/badge/Soporte-FormData-16A34A)

- URL base configurada desde `VITE_API_BASE_URL`.
- Construcción automática de query params (compatible con arrays).
- Si el body es `FormData`, omite el header `Content-Type` para que el navegador lo gestione con el boundary correcto.
- Respuestas 204 devuelven `null`.
- Los errores lanzan `ApiError` con `{ message, status, url, payload }`.

### 🧾 Endpoints

![Entidades](https://img.shields.io/badge/Entidades-users%20teachers%20activities%20enrollments-334155)
![CRUD](https://img.shields.io/badge/Operaciones-CRUD-2563EB)

#### Usuarios

| Método | Ruta | Servicio |
| --- | --- | --- |
| `GET` | `/users` | `usersService.list(query)` |
| `GET` | `/users/active` | `usersService.listActive()` |
| `GET` | `/users/:id` | `usersService.getById(userId)` |
| `POST` | `/users` | `usersService.create(payload)` |
| `PUT` | `/users/:id` | `usersService.update(userId, payload)` |
| `DELETE` | `/users/:id` | `usersService.remove(userId)` |

#### Monitores

| Método | Ruta | Servicio |
| --- | --- | --- |
| `GET` | `/teachers` | `teachersService.list(query)` |
| `GET` | `/teachers/active` | `teachersService.listActive()` |
| `GET` | `/teachers/:id` | `teachersService.getById(teacherId)` |
| `POST` | `/teachers` | `teachersService.create(payload)` |
| `PUT` | `/teachers/:id` | `teachersService.update(teacherId, payload)` |
| `DELETE` | `/teachers/:id` | `teachersService.remove(teacherId)` |

#### Actividades

| Método | Ruta | Servicio |
| --- | --- | --- |
| `GET` | `/activities/future` | `activitiesService.list(query)` |
| `GET` | `/activities/:id` | `activitiesService.getById(activityId)` |
| `GET` | `/activities/teacher/:id` | `activitiesService.listByTeacher(teacherId)` |
| `POST` | `/activities` | `activitiesService.create(payload)` |
| `PUT` | `/activities/:id` | `activitiesService.update(activityId, payload)` |
| `DELETE` | `/activities/:id` | `activitiesService.remove(activityId)` |

#### Inscripciones

| Método | Ruta | Servicio |
| --- | --- | --- |
| `GET` | `/users/:id/activities` | `enrollmentsService.listByUser(userId)` |
| `POST` | `/activities/:id/users/:id` | `enrollmentsService.register(activityId, userId)` |
| `DELETE` | `/activities/:id/users/:id` | `enrollmentsService.remove(activityId, userId)` |

### 🔄 Mappers (`src/services/mappers/`)

![Transformaci%C3%B3n](https://img.shields.io/badge/Transformaci%C3%B3n-DTO%20a%20UI-7C3AED)
![Vista](https://img.shields.io/badge/Salida-Modelos%20de%20vista-0EA5E9)

Los mappers transforman los DTOs del backend al modelo que esperan los componentes.

| Archivo | Funciones exportadas |
| --- | --- |
| `usersMapper.js` | `mapUserDtoToRow`, `buildUsersSummaryMetrics` |
| `teachersMapper.js` | `mapTeacherDtoToRow`, `buildTeachersSummaryMetrics` |
| `activitiesMapper.js` | `mapActivityDtoToCard`, `mapActivitiesCatalog`, `buildCatalogHighlights` |
| `enrollmentsMapper.js` | `mapUserCandidate`, `mapEnrollmentActivityOptions`, `mapUserActivityRows` |
| `dashboardMapper.js` | `buildDashboardMetrics`, `buildUpcomingActivities` |

`mapActivitiesCatalog` agrupa las actividades por `title + teacherId` antes de renderizar, de modo que varias sesiones de la misma clase aparecen en una sola tarjeta.

---

## 🎨 Componentes UI reutilizables

![UI](https://img.shields.io/badge/UI-Reutilizable-7C3AED)
![Componentes](https://img.shields.io/badge/Componentes-Base-2563EB)

Viven en `src/components/ui/` y no contienen lógica de negocio.

### 🖱️ Interacción

![UX](https://img.shields.io/badge/UX-Acciones%20primarias-14B8A6)
![Controles](https://img.shields.io/badge/Controles-Button%20Modal%20Toggle-0F172A)

| Componente | Props principales | Descripción |
| --- | --- | --- |
| `Button` | `variant` (primary\|secondary\|ghost), `size` (sm\|md), `iconLeft`, `iconRight`, `fullWidth` | Botón base |
| `Modal` | `title`, `description`, `onClose`, `size` (md\|lg) | Dialog con overlay y cierre por Escape |
| `ToggleSwitch` | `checked`, `onChange`, `label`, `disabled` | Interruptor on/off |
| `SelectableCard` | `selected`, `onClick` | Card clickeable con estado seleccionado |
| `FloatingActionButton` | `icon`, `onClick`, `ariaLabel` | FAB circular |

### 📋 Datos y tablas

![Tabla](https://img.shields.io/badge/Data-Table%20system-2563EB)
![Paginaci%C3%B3n](https://img.shields.io/badge/UI-Paginaci%C3%B3n-0EA5E9)

| Componente | Props principales | Descripción |
| --- | --- | --- |
| `DataTable` | `columns`, `rows`, `rowKey`, `header`, `footer`, `emptyState` | Tabla genérica con renderizado por columna configurable |
| `TableToolbar` | `title`, `actions` | Cabecera de tabla con acciones |
| `Pagination` | `page`, `totalPages`, `onPageChange` | Navegación entre páginas |
| `AvatarCell` | `imageUrl`, `title`, `subtitle` | Celda con avatar (imagen o iniciales) |

### 🚦 Feedback y estados

![Estado](https://img.shields.io/badge/Estado-Loading%20%7C%20Empty%20%7C%20Badge-F59E0B)
![Feedback](https://img.shields.io/badge/Feedback-Visible-16A34A)

| Componente | Props principales | Descripción |
| --- | --- | --- |
| `EmptyState` | `title`, `description`, `icon`, `action` | Placeholder para listas vacías |
| `LoadingState` | `lines` | Skeleton de carga |
| `StatusBadge` | `label`, `tone` (active\|inactive\|attention) | Badge de estado coloreado |
| `InfoBanner` | — | Banner informativo |
| `ProgressBar` | `value`, `label`, `tone`, `valueLabel` | Barra de progreso con etiqueta |

### 🧱 Layout y contenedores

![Layout](https://img.shields.io/badge/Layout-Page%20structure-334155)
![Cards](https://img.shields.io/badge/Surface-Cards-7C3AED)

| Componente | Props principales | Descripción |
| --- | --- | --- |
| `PageContainer` | — | Wrapper de página con clase `page-container` |
| `PageHeader` | `title`, `description`, `breadcrumb[]`, `actions` | Cabecera de sección con breadcrumb y acciones |
| `SurfaceCard` | `className` | Tarjeta contenedora base |
| `StatCard` | `label`, `value`, `meta`, `icon`, `badge`, `tone` | Tarjeta de métrica/KPI. Tones: primary, accent, warning, revenue, neutral |

### 🔣 Iconos

![SVG](https://img.shields.io/badge/Iconos-SVG%20inline-2563EB)
![Set](https://img.shields.io/badge/Colecci%C3%B3n-UI%20essentials-0EA5E9)

`Icon` renderiza SVG inline. Props: `name`, `size` (default 20), `className`.

Iconos disponibles:

```text
dashboard   menu        chevron     search      logout
users       teachers    activities  enrollments
edit        plus        close       download    filter
check       warning     bell        settings    help
spark       calendar    user        clock
```

---

## 🧰 Utilidades

![Helpers](https://img.shields.io/badge/Helpers-Formatters%20y%20classNames-0F172A)
![Reuso](https://img.shields.io/badge/Reuso-Funciones%20puras-14B8A6)

### 🧮 `src/utils/formatters.js`

![Locale](https://img.shields.io/badge/Locale-es--ES-DC2626)
![Salida](https://img.shields.io/badge/Formato-Fecha%20y%20moneda-16A34A)

| Función | Entrada | Salida ejemplo |
| --- | --- | --- |
| `formatCurrency(value)` | `1200` | `"1.200 €"` |
| `formatDate(value)` | ISO string | `"16 abr 2026"` |
| `formatDateTime(value)` | ISO string | `"16 abr 12:30"` |

Locale fijo: `es-ES`.

### 🧵 `src/utils/classNames.js`

![Utility](https://img.shields.io/badge/Utility-classNames-2563EB)
![CSS](https://img.shields.io/badge/Concatena-clases-7C3AED)

```js
classNames("base", condition && "modifier", false, "other")
// → "base modifier other"
```

Filtra valores falsy y concatena con espacio. Equivalente ligero a `clsx`.

---

## 🎯 Estilos

![CSS](https://img.shields.io/badge/CSS-Vanilla-1572B6?logo=css3&logoColor=white)
![Tokens](https://img.shields.io/badge/Design-Custom%20properties-0EA5E9)
![Modular](https://img.shields.io/badge/Estrategia-CSS%20colocalizado-334155)

Todo el CSS está en `src/styles/index.css` más ficheros CSS colocalizados junto a los componentes que lo necesitan (`UsersTableSection.css`, `TeachersTableSection.css`, `Modal.css`, etc.).

El sistema de diseño se basa en custom properties CSS definidas en `:root`:

- `--surface-*` — fondos de superficies
- `--ink-*` — colores de texto (ink, ink-soft, ink-muted)
- `--accent-*` — color principal de acción
- `--status-*` — colores semánticos (active, inactive, attention)

No se usa ningún framework CSS externo (ni Tailwind, ni Bootstrap).
