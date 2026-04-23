import { formatCurrency, formatDateTime } from "../../utils/formatters";

export const attendanceStatusLabels = {
  PENDING: { label: "Pendiente", tone: "neutral" },
  ATTENDED: { label: "Asistió", tone: "active" },
  ABSENT: { label: "No asistió", tone: "inactive" },
  CANCELLED: { label: "Cancelada", tone: "attention" }
};

export function mapEnrollmentRow(enrollment) {
  const statusKey = enrollment.attendanceStatus ?? "PENDING";
  const statusMeta =
    attendanceStatusLabels[statusKey] ?? attendanceStatusLabels.PENDING;

  return {
    activityId: enrollment.activityId,
    activityTitle: enrollment.activityTitle ?? "",
    attendanceStatus: statusKey,
    attendanceLabel: statusMeta.label,
    attendanceTone: statusMeta.tone,
    cancelledAt: enrollment.cancelledAt,
    discountApplied: enrollment.discountApplied ?? null,
    isCancelled: statusKey === "CANCELLED" || Boolean(enrollment.cancelledAt),
    notes: enrollment.notes ?? "",
    paid: Boolean(enrollment.paid),
    pricePaid: enrollment.pricePaid ?? null,
    pricePaidLabel:
      enrollment.pricePaid != null ? formatCurrency(enrollment.pricePaid) : "—",
    registeredAt: enrollment.registeredAt,
    userFullName: enrollment.userFullName ?? `Socio #${enrollment.userId}`,
    userId: enrollment.userId
  };
}

export function buildRosterSummary(rows, activityPrice = 0) {
  const total = rows.length;
  const active = rows.filter((row) => !row.isCancelled).length;
  const paid = rows.filter((row) => row.paid && !row.isCancelled).length;
  const attended = rows.filter(
    (row) => row.attendanceStatus === "ATTENDED"
  ).length;
  const revenueReal = rows.reduce(
    (total, row) => total + (row.paid ? Number(row.pricePaid || 0) : 0),
    0
  );
  const pendingRevenue = rows
    .filter((row) => !row.paid && !row.isCancelled)
    .reduce(
      (total, row) =>
        total + Number(row.pricePaid ?? activityPrice ?? 0),
      0
    );

  return {
    active,
    attended,
    paid,
    pendingRevenue,
    pendingRevenueLabel: formatCurrency(pendingRevenue),
    revenueReal,
    revenueRealLabel: formatCurrency(revenueReal),
    total
  };
}

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
    enrolledCount: activity.enrolledCount ?? 0,
    id: activity.id,
    priceLabel: formatCurrency(activity.price),
    schedule: formatDateTime(activity.date),
    teacher:
      teacherNameById.get(activity.teacherId) ??
      `Monitor #${activity.teacherId}`,
    teacherId: activity.teacherId ?? null,
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
