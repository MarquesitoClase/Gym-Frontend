import { formatDateTime } from "../../utils/formatters";

function buildTeacherMap(teachers) {
  return new Map(
    teachers.map((teacher) => [
      teacher.id,
      [teacher.firstName, teacher.lastName].filter(Boolean).join(" ")
    ])
  );
}

function getCoverTone(title = "", description = "") {
  const content = `${title} ${description}`.toLowerCase();

  if (content.includes("yoga") || content.includes("medit")) {
    return "yoga";
  }

  if (content.includes("spin") || content.includes("cicl")) {
    return "spinning";
  }

  if (
    content.includes("cross") ||
    content.includes("funcional") ||
    content.includes("strength")
  ) {
    return "strength";
  }

  if (content.includes("zumba") || content.includes("hiit") || content.includes("baile")) {
    return "hiit";
  }

  if (content.includes("pilates")) {
    return "pilates";
  }

  if (content.includes("box") || content.includes("fight")) {
    return "boxing";
  }

  return "strength";
}

function getCategory(title = "", description = "") {
  const content = `${title} ${description}`.toLowerCase();

  if (content.includes("yoga")) {
    return "Wellness";
  }

  if (content.includes("medit")) {
    return "Mindfulness";
  }

  if (content.includes("pilates")) {
    return "Pilates";
  }

  if (content.includes("spin") || content.includes("cicl")) {
    return "Cardio";
  }

  if (content.includes("zumba") || content.includes("baile")) {
    return "Dance";
  }

  if (content.includes("box")) {
    return "Boxing";
  }

  return "Strength";
}

export function mapActivityDtoToCard(activity, teacherNameById) {
  return {
    category: getCategory(activity.title, activity.description),
    coverTone: getCoverTone(activity.title, activity.description),
    description: activity.description,
    id: activity.id,
    imageUrl: activity.imageUrl ?? null,
    price: activity.price,
    schedule: formatDateTime(activity.date),
    status: "active",
    teacher:
      teacherNameById.get(activity.teacherId) ??
      `Monitor #${activity.teacherId}`,
    title: activity.title
  };
}

export function mapActivitiesCatalog(activities, teachers) {
  const teacherNameById = buildTeacherMap(teachers);

  // Group sessions by title only — different teachers for the same class share one card
  const groups = new Map();
  for (const activity of activities) {
    const key = activity.title.trim().toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, { base: activity, sessions: [] });
    }
    groups.get(key).sessions.push({
      enrolledCount: activity.enrolledCount ?? 0,
      id: activity.id,
      schedule: formatDateTime(activity.date),
      teacherName:
        teacherNameById.get(activity.teacherId) ?? `Monitor #${activity.teacherId}`
    });
  }

  return [...groups.values()].map(({ base, sessions }) => {
    const uniqueTeachers = [...new Set(sessions.map((s) => s.teacherName))];
    return {
      category: getCategory(base.title, base.description),
      coverTone: getCoverTone(base.title, base.description),
      description: base.description,
      id: sessions[0].id,
      imageUrl: base.imageUrl ?? null,
      price: base.price,
      sessions,
      status: "active",
      teacher:
        uniqueTeachers.length === 1
          ? uniqueTeachers[0]
          : `${uniqueTeachers.length} monitores`,
      title: base.title
    };
  });
}
