export const dashboardMetrics = [
  {
    id: "users",
    label: "Usuarios activos",
    meta: "+12 en los últimos 30 días",
    tone: "primary",
    value: "184"
  },
  {
    id: "teachers",
    label: "Profesores activos",
    meta: "14 con agenda publicada",
    tone: "accent",
    value: "14"
  },
  {
    id: "courses",
    label: "Actividades futuras",
    meta: "18 sesiones abiertas esta semana",
    tone: "neutral",
    value: "18"
  },
  {
    id: "enrollments",
    label: "Inscripciones hoy",
    meta: "27 operaciones en recepción",
    tone: "warning",
    value: "27"
  }
];

export const upcomingActivities = [
  {
    id: "act-01",
    name: "Velo Pulse Spinning",
    schedule: "Hoy · 07:00",
    spots: "2 plazas libres",
    status: "Activa",
    teacher: "Marco Rossi"
  },
  {
    id: "act-02",
    name: "Zen Flow Yoga",
    schedule: "Hoy · 18:00",
    spots: "6 plazas libres",
    status: "Activa",
    teacher: "Elena Suárez"
  },
  {
    id: "act-03",
    name: "Titan Strength Lab",
    schedule: "Mañana · 17:00",
    spots: "Lista de espera",
    status: "Completa",
    teacher: "Sarah Kim"
  }
];

export const receptionUpdates = [
  {
    id: "update-01",
    title: "Cuotas pendientes",
    description: "5 usuarios necesitan validar la cuota anual antes de inscribirse.",
    tone: "attention"
  },
  {
    id: "update-02",
    title: "Profesores no asignables",
    description: "2 profesores figuran como inactivos y no deben vincularse a nuevas actividades.",
    tone: "inactive"
  },
  {
    id: "update-03",
    title: "Control de duplicidades",
    description: "La próxima integración de backend bloqueará inscripciones repetidas en una misma actividad.",
    tone: "neutral"
  }
];

export const quickActions = [
  {
    id: "quick-01",
    title: "Inscripción rápida",
    detail: "Accede al panel preparado para registrar usuarios en actividades."
  },
  {
    id: "quick-02",
    title: "Catálogo de actividades",
    detail: "Consulta horarios, profesores asignados y estado de cada sesión."
  },
  {
    id: "quick-03",
    title: "Control de profesores",
    detail: "Revisa disponibilidad, especialidades y actividad reciente del equipo docente."
  }
];
