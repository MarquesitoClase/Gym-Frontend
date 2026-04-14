export const availableActivities = [
  {
    id: "slot-01",
    occupancy: "2 plazas libres",
    schedule: "Hoy · 18:00",
    teacher: "Elena Suárez",
    title: "Zen Flow Yoga"
  },
  {
    id: "slot-02",
    occupancy: "4 plazas libres",
    schedule: "Mañana · 09:00",
    teacher: "Lara Nanda",
    title: "Reformer Core"
  },
  {
    id: "slot-03",
    occupancy: "Última plaza",
    schedule: "Viernes · 20:00",
    teacher: "Mike Vega",
    title: "Striker Boxing"
  }
];

export const validationChecklist = [
  {
    id: "rule-01",
    label: "Cuota anual",
    state: "pending",
    text: "La validación real llegará desde backend antes de confirmar la inscripción."
  },
  {
    id: "rule-02",
    label: "Duplicidad",
    state: "pending",
    text: "Se comprobará que el usuario no esté inscrito dos veces en la misma actividad."
  },
  {
    id: "rule-03",
    label: "Límite de futuras",
    state: "pending",
    text: "La API bloqueará usuarios con más de tres actividades futuras activas."
  }
];

export const recentEnrollments = [
  {
    activity: "Velo Pulse Spinning",
    id: "enrollment-01",
    schedule: "2026-04-14 07:00",
    status: "confirmed",
    user: "Laura Sánchez"
  },
  {
    activity: "Zen Flow Yoga",
    id: "enrollment-02",
    schedule: "2026-04-14 18:00",
    status: "pending",
    user: "Daniel Romero"
  },
  {
    activity: "Reformer Core",
    id: "enrollment-03",
    schedule: "2026-04-15 09:00",
    status: "confirmed",
    user: "Marta Pérez"
  }
];
