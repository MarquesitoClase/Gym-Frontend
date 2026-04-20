# 🏋️ Titan Gym — Frontend

[README en español](./README.md)

![Status](https://img.shields.io/badge/Status-Active-2563EB)
![Language](https://img.shields.io/badge/Language-English-E11D48)
![Frontend](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)

Internal admin panel for Titan Gym operational management. Focused on front desk and coordination workflows, built with React 19 and ready to integrate with a Spring Boot backend.

---

## 🧭 Table of contents

![Sections](https://img.shields.io/badge/Sections-12-0F172A)
![Navigation](https://img.shields.io/badge/Navigation-Internal-14B8A6)

1. Technology stack
2. Getting started
3. Environment variables
4. Available scripts
5. Project architecture
6. Application routes
7. Authentication
8. Functional modules (features)
9. API services
10. Reusable UI components
11. Utilities
12. Styles

---

## 🧱 Technology stack

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Router](https://img.shields.io/badge/Router-React_Router_7-CA4245?logo=reactrouter&logoColor=white)

| Layer | Technology |
| --- | --- |
| UI Framework | React 19.2 |
| Routing | React Router 7.14 |
| Bundler | Vite 8.0 |
| Styling | Modular vanilla CSS |
| Linting | ESLint 9 + React plugins |
| HTTP | Native Fetch with a custom wrapper |

There is no global state manager (Redux, Zustand, etc.). All state lives in local hooks inside each feature.

---

## 🚀 Getting started

![Node](https://img.shields.io/badge/Node-Required-339933?logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-Install%20%26%20Run-CB3837?logo=npm&logoColor=white)
![Localhost](https://img.shields.io/badge/Dev-localhost%3A5173-0EA5E9)

```bash
# 1. Install dependencies
npm install

# 2. Create the environment file
echo VITE_API_BASE_URL=http://localhost:8080/api > .env.local

# 3. Start development
npm run dev
```

The app runs on `http://localhost:5173` by default.

---

## 🔐 Environment variables

![Vite](https://img.shields.io/badge/VITE_API_BASE_URL-Configurable-646CFF?logo=vite&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?logo=springboot&logoColor=white)

| Variable | Required | Description | Default value |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | Base URL of the Spring Boot backend | `http://localhost:8080/api` |

---

## 🛠️ Available scripts

![Dev](https://img.shields.io/badge/Script-dev-2563EB)
![Build](https://img.shields.io/badge/Script-build-16A34A)
![Lint](https://img.shields.io/badge/Script-lint-F59E0B)

| Command | Action |
| --- | --- |
| `npm run dev` | Development server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Static analysis with ESLint |

---

## 🏗️ Project architecture

![Architecture](https://img.shields.io/badge/Architecture-Feature--based-0F172A)
![UI](https://img.shields.io/badge/UI-Reusable-7C3AED)
![Services](https://img.shields.io/badge/Services-API%20Layer-0891B2)

```text
src/
├── app/                    # Entry point (App.jsx)
├── auth/                   # Authentication context and guard
├── layout/                 # Global shell, sidebar, and topbar
├── router/                 # Route definitions and AppRouter
├── pages/                  # Page components (one per route)
├── features/               # Functional blocks by domain
│   ├── activities/
│   ├── dashboard/
│   ├── enrollments/
│   ├── teachers/
│   └── users/
├── components/
│   └── ui/                 # Reusable components without business logic
├── services/
│   ├── endpoints/          # One service per API entity
│   ├── http/               # HTTP client, ApiError, helpers
│   └── mappers/            # DTO → view model transformations
├── utils/                  # Shared pure functions
└── styles/                 # Global theme and application styles
```

**General pattern:** each feature is autonomous — it contains its own main component, loading logic, and when needed its own styles. Services and UI components are shared horizontally.

---

## 🗺️ Application routes

![Routing](https://img.shields.io/badge/Routing-React_Router-CA4245?logo=reactrouter&logoColor=white)
![Protection](https://img.shields.io/badge/Routes-Protected-DC2626)

| Route | Page | Protected | Description |
| --- | --- | --- | --- |
| `/login` | `LoginPage` | No | Access to the panel |
| `/` | `DashboardPage` | Yes | Main operational dashboard |
| `/actividades` | `ActivitiesPage` | Yes | Classes and workshops catalog |
| `/usuarios` | `UsersPage` | Yes | Members management |
| `/profesores` | `TeachersPage` | Yes | Monitors management |
| `/inscripciones` | `EnrollmentsPage` | Yes | Quick member enrollment |
| `/*` | `NotFoundPage` | Yes | Catch-all 404 |

Protected routes redirect to `/login` when there is no active session (`ProtectedRoute`).

---

## 🔐 Authentication

![Auth](https://img.shields.io/badge/Auth-Local-F97316)
![Storage](https://img.shields.io/badge/Persistence-localStorage-0EA5E9)

Local authentication without backend integration. Credentials are hardcoded in `src/auth/AuthContext.jsx`.

| Field | Value |
| --- | --- |
| Email | `admin@titangym.com` |
| Password | `Admin1234` |
| Name | Admin Titan |
| Role | Main administrator |

The session is persisted in `localStorage` under the `titan_gym_auth` key. The `useAuth()` hook exposes `{ isAuthenticated, admin, login, logout }` to any component.

---

## 🧩 Functional modules (features)

![Features](https://img.shields.io/badge/Features-5-1D4ED8)
![Domains](https://img.shields.io/badge/Domains-Dashboard%20%7C%20CRUD%20%7C%20Enrollments-334155)

### 📊 Dashboard (`/`)

![View](https://img.shields.io/badge/View-Operational-2563EB)
![Summary](https://img.shields.io/badge/Data-Metrics%20and%20agenda-14B8A6)

Welcome panel with a real-time operational view.

- **Main metrics:** active members, active classes, projected revenue with a progress bar toward the goal (€50,000).
- **Upcoming activities:** up to 5 future classes sorted by date, with monitor, time, enrollments, and price.
- **Quick actions:** shortcuts to the main sections.
- **Last registered member:** avatar, name, and status.

Loads data in parallel from `usersService`, `teachersService`, and `activitiesService`.

---

### 🏃 Activities (`/actividades`)

![Catalog](https://img.shields.io/badge/Section-Catalog-7C3AED)
![Modal](https://img.shields.io/badge/Flow-Create%20and%20edit-0EA5E9)

Visual catalog of future classes and workshops.

**Catalog view (`ActivityCatalog`):**

- Grid with the first 4 activities in the top area and 2 additional ones in the bottom area.
- Activities with the same title and monitor are grouped into a single card showing all sessions as date chips.
- Catalog insights: premium activity, projected revenue, number of monitors with classes.

**Activity card (`ActivityCard`):**

- Automatic cover image by activity type (yoga, pilates, spinning, hiit, boxing, strength).
- Price, assigned monitor, and session list with date and enrollment count per session.
- Edit button that opens the modal.

**Form (`ActivityFormModal`):**

- Activity creation and editing.
- Automatic session generator: weekly or twice a week from an initial date.
- Ability to add, edit, and remove additional manual dates.
- A single submission can create multiple sessions at once.
- Validations: title and monitor required, minimum date = now.

---

### 👥 Users (`/usuarios`)

![Members](https://img.shields.io/badge/Entity-Members-2563EB)
![Table](https://img.shields.io/badge/UI-Paginated%20table-14B8A6)

Full member directory management.

**Table (`UsersTableSection`):**

- Pagination of 4 items per page.
- Summary metrics: total, active, and inactive.
- Columns: photo, full name, ID, enrollment year, active/inactive status, actions.
- Quick active/inactive toggle without opening the modal.

**Form (`UserFormModal`):**

- Fields: first name, last name, ID, enrollment year, photo, active status.
- Image preview before saving.
- **Enrollments tab** (edit mode only):

  - List of activities the member is enrolled in.
  - Option to remove the member from an activity.
  - Option to enroll in a new activity from the same modal.
- Member deletion with confirmation.

---

### 🏋️‍♂️ Monitors (`/profesores`)

![Team](https://img.shields.io/badge/Entity-Monitors-F97316)
![Assignments](https://img.shields.io/badge/Data-Assigned%20activities-0EA5E9)

Management of the monitor team.

**Table (`TeachersTableSection`):**

- Pagination of 4 items per page.
- Metrics: total staff, active classes, retention rate.
- Columns: photo, full name, ID, hiring year, assigned activities (chips), edit action.

**Form (`TeacherFormModal`):**

- Fields: first name, last name, ID, hiring year, photo, active status.
- Image preview.
- Monitor deletion with confirmation.

---

### 📝 Enrollments (`/inscripciones`)

![Flow](https://img.shields.io/badge/Process-3%20steps-2563EB)
![Validations](https://img.shields.io/badge/Rules-Frontend%20%2B%20Backend-DC2626)

Guided 3-step flow to enroll a member in an activity.

```text
Step 1 — Choose member   →   Step 2 — Choose activity   →   Step 3 — Confirm
```

**Step 1:** search by name or ID, list with avatar, member name, and status.

**Step 2:** list of available future activities. Already-enrolled activities are marked and cannot be selected.

**Step 3:** confirmation bar with summary (member, activity, date, price) and confirm button.

**Validations before submitting:**

- Member must be active.
- Member cannot already be enrolled in that activity.
- Member cannot exceed 3 simultaneous future activities.
- Activity must have a monitor assigned (backend rejects empty `teacherId`).

After confirmation, the enrollment count is refreshed and the user can enroll in another activity without restarting the flow.

---

## 🌐 API services

![HTTP](https://img.shields.io/badge/HTTP-Fetch-0EA5E9)
![REST](https://img.shields.io/badge/API-REST-2563EB)
![DTO](https://img.shields.io/badge/Mapping-DTO%20to%20view-7C3AED)

All services live in `src/services/endpoints/` and use the central HTTP client.

### 🔌 HTTP client (`src/services/http/apiClient.js`)

![Wrapper](https://img.shields.io/badge/Wrapper-apiClient-0891B2)
![FormData](https://img.shields.io/badge/Support-FormData-16A34A)

- Base URL configured from `VITE_API_BASE_URL`.
- Automatic query param building (array-compatible).
- If the body is `FormData`, it omits the `Content-Type` header so the browser can handle the proper boundary.
- `204` responses return `null`.
- Errors throw `ApiError` with `{ message, status, url, payload }`.

### 🧾 Endpoints

![Entities](https://img.shields.io/badge/Entities-users%20teachers%20activities%20enrollments-334155)
![CRUD](https://img.shields.io/badge/Operations-CRUD-2563EB)

#### Users

| Method | Route | Service |
| --- | --- | --- |
| `GET` | `/users` | `usersService.list(query)` |
| `GET` | `/users/active` | `usersService.listActive()` |
| `GET` | `/users/:id` | `usersService.getById(userId)` |
| `POST` | `/users` | `usersService.create(payload)` |
| `PUT` | `/users/:id` | `usersService.update(userId, payload)` |
| `DELETE` | `/users/:id` | `usersService.remove(userId)` |

#### Monitors

| Method | Route | Service |
| --- | --- | --- |
| `GET` | `/teachers` | `teachersService.list(query)` |
| `GET` | `/teachers/active` | `teachersService.listActive()` |
| `GET` | `/teachers/:id` | `teachersService.getById(teacherId)` |
| `POST` | `/teachers` | `teachersService.create(payload)` |
| `PUT` | `/teachers/:id` | `teachersService.update(teacherId, payload)` |
| `DELETE` | `/teachers/:id` | `teachersService.remove(teacherId)` |

#### Activities

| Method | Route | Service |
| --- | --- | --- |
| `GET` | `/activities/future` | `activitiesService.list(query)` |
| `GET` | `/activities/:id` | `activitiesService.getById(activityId)` |
| `GET` | `/activities/teacher/:id` | `activitiesService.listByTeacher(teacherId)` |
| `POST` | `/activities` | `activitiesService.create(payload)` |
| `PUT` | `/activities/:id` | `activitiesService.update(activityId, payload)` |
| `DELETE` | `/activities/:id` | `activitiesService.remove(activityId)` |

#### Enrollments

| Method | Route | Service |
| --- | --- | --- |
| `GET` | `/users/:id/activities` | `enrollmentsService.listByUser(userId)` |
| `POST` | `/activities/:id/users/:id` | `enrollmentsService.register(activityId, userId)` |
| `DELETE` | `/activities/:id/users/:id` | `enrollmentsService.remove(activityId, userId)` |

### 🔄 Mappers (`src/services/mappers/`)

![Transformation](https://img.shields.io/badge/Transformation-DTO%20to%20UI-7C3AED)
![Output](https://img.shields.io/badge/Output-View%20models-0EA5E9)

Mappers transform backend DTOs into the model expected by the components.

| File | Exported functions |
| --- | --- |
| `usersMapper.js` | `mapUserDtoToRow`, `buildUsersSummaryMetrics` |
| `teachersMapper.js` | `mapTeacherDtoToRow`, `buildTeachersSummaryMetrics` |
| `activitiesMapper.js` | `mapActivityDtoToCard`, `mapActivitiesCatalog`, `buildCatalogHighlights` |
| `enrollmentsMapper.js` | `mapUserCandidate`, `mapEnrollmentActivityOptions`, `mapUserActivityRows` |
| `dashboardMapper.js` | `buildDashboardMetrics`, `buildUpcomingActivities` |

`mapActivitiesCatalog` groups activities by `title + teacherId` before rendering, so several sessions of the same class appear on a single card.

---

## 🎨 Reusable UI components

![UI](https://img.shields.io/badge/UI-Reusable-7C3AED)
![Components](https://img.shields.io/badge/Components-Base-2563EB)

They live in `src/components/ui/` and contain no business logic.

### 🖱️ Interaction

![UX](https://img.shields.io/badge/UX-Primary%20actions-14B8A6)
![Controls](https://img.shields.io/badge/Controls-Button%20Modal%20Toggle-0F172A)

| Component | Main props | Description |
| --- | --- | --- |
| `Button` | `variant` (primary\|secondary\|ghost), `size` (sm\|md), `iconLeft`, `iconRight`, `fullWidth` | Base button |
| `Modal` | `title`, `description`, `onClose`, `size` (md\|lg) | Dialog with overlay and Escape close |
| `ToggleSwitch` | `checked`, `onChange`, `label`, `disabled` | On/off switch |
| `SelectableCard` | `selected`, `onClick` | Clickable card with selected state |
| `FloatingActionButton` | `icon`, `onClick`, `ariaLabel` | Circular FAB |

### 📋 Data and tables

![Table](https://img.shields.io/badge/Data-Table%20system-2563EB)
![Pagination](https://img.shields.io/badge/UI-Pagination-0EA5E9)

| Component | Main props | Description |
| --- | --- | --- |
| `DataTable` | `columns`, `rows`, `rowKey`, `header`, `footer`, `emptyState` | Generic table with configurable per-column rendering |
| `TableToolbar` | `title`, `actions` | Table header with actions |
| `Pagination` | `page`, `totalPages`, `onPageChange` | Page navigation |
| `AvatarCell` | `imageUrl`, `title`, `subtitle` | Cell with avatar (image or initials) |

### 🚦 Feedback and states

![State](https://img.shields.io/badge/State-Loading%20%7C%20Empty%20%7C%20Badge-F59E0B)
![Feedback](https://img.shields.io/badge/Feedback-Visible-16A34A)

| Component | Main props | Description |
| --- | --- | --- |
| `EmptyState` | `title`, `description`, `icon`, `action` | Placeholder for empty lists |
| `LoadingState` | `lines` | Loading skeleton |
| `StatusBadge` | `label`, `tone` (active\|inactive\|attention) | Colored status badge |
| `InfoBanner` | — | Informational banner |
| `ProgressBar` | `value`, `label`, `tone`, `valueLabel` | Progress bar with label |

### 🧱 Layout and containers

![Layout](https://img.shields.io/badge/Layout-Page%20structure-334155)
![Cards](https://img.shields.io/badge/Surface-Cards-7C3AED)

| Component | Main props | Description |
| --- | --- | --- |
| `PageContainer` | — | Page wrapper with the `page-container` class |
| `PageHeader` | `title`, `description`, `breadcrumb[]`, `actions` | Section header with breadcrumb and actions |
| `SurfaceCard` | `className` | Base container card |
| `StatCard` | `label`, `value`, `meta`, `icon`, `badge`, `tone` | Metric/KPI card. Tones: primary, accent, warning, revenue, neutral |

### 🔣 Icons

![SVG](https://img.shields.io/badge/Icons-Inline%20SVG-2563EB)
![Set](https://img.shields.io/badge/Collection-UI%20essentials-0EA5E9)

`Icon` renders inline SVG. Props: `name`, `size` (default 20), `className`.

Available icons:

```text
dashboard   menu        chevron     search      logout
users       teachers    activities  enrollments
edit        plus        close       download    filter
check       warning     bell        settings    help
spark       calendar    user        clock
```

---

## 🧰 Utilities

![Helpers](https://img.shields.io/badge/Helpers-Formatters%20and%20classNames-0F172A)
![Reuse](https://img.shields.io/badge/Reuse-Pure%20functions-14B8A6)

### 🧮 `src/utils/formatters.js`

![Locale](https://img.shields.io/badge/Locale-es--ES-DC2626)
![Output](https://img.shields.io/badge/Format-Date%20and%20currency-16A34A)

| Function | Input | Example output |
| --- | --- | --- |
| `formatCurrency(value)` | `1200` | `"1.200 €"` |
| `formatDate(value)` | ISO string | `"16 Apr 2026"` |
| `formatDateTime(value)` | ISO string | `"16 Apr 12:30"` |

Fixed locale: `es-ES`.

### 🧵 `src/utils/classNames.js`

![Utility](https://img.shields.io/badge/Utility-classNames-2563EB)
![CSS](https://img.shields.io/badge/Concatenates-classes-7C3AED)

```js
classNames("base", condition && "modifier", false, "other")
// → "base modifier other"
```

Filters falsy values and joins them with spaces. Lightweight equivalent to `clsx`.

---

## 🎯 Styles

![CSS](https://img.shields.io/badge/CSS-Vanilla-1572B6?logo=css3&logoColor=white)
![Tokens](https://img.shields.io/badge/Design-Custom%20properties-0EA5E9)
![Modular](https://img.shields.io/badge/Strategy-Colocated%20CSS-334155)

All CSS lives in `src/styles/index.css` plus colocated CSS files next to the components that need them (`UsersTableSection.css`, `TeachersTableSection.css`, `Modal.css`, etc.).

The design system is based on CSS custom properties defined in `:root`:

- `--surface-*` — surface backgrounds
- `--ink-*` — text colors (ink, ink-soft, ink-muted)
- `--accent-*` — primary action color
- `--status-*` — semantic colors (active, inactive, attention)

No external CSS framework is used (no Tailwind, no Bootstrap).
