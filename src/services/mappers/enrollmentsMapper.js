import { formatCurrency, formatDateTime } from "../../utils/formatters";

function buildTeacherMap(teachers) {
  return new Map(
    teachers.map((teacher) => [
      teacher.id,
      [teacher.firstName, teacher.lastName].filter(Boolean).join(" ")
    ])
  );
}

export function mapUserCandidate(user) {
  return {
    active: Boolean(user.active),
    avatarUrl: user.imageUrl ?? null,
    id: user.id,
    identifier: user.dni,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    registrationYear: user.registrationYear
  };
}

export function mapEnrollmentActivityOptions(activities, teachers, enrolledIds) {
  const teacherNameById = buildTeacherMap(teachers);

  return activities.map((activity) => ({
    alreadyEnrolled: enrolledIds.has(activity.id),
    description: activity.description,
    id: activity.id,
    priceLabel: formatCurrency(activity.price),
    schedule: formatDateTime(activity.date),
    teacher:
      teacherNameById.get(activity.teacherId) ??
      `Monitor #${activity.teacherId}`,
    title: activity.title
  }));
}

export function mapUserActivityRows(activities, teachers) {
  const teacherNameById = buildTeacherMap(teachers);

  return activities.map((activity) => ({
    activity: activity.title,
    id: activity.id,
    schedule: formatDateTime(activity.date),
    status: "confirmed",
    teacher:
      teacherNameById.get(activity.teacherId) ??
      `Monitor #${activity.teacherId}`
  }));
}
