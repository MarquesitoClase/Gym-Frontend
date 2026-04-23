import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Icon } from "../../components/Icon/Icon";
import { LoadingState } from "../../components/LoadingState/LoadingState";
import { Modal } from "../../components/Modal/Modal";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { activitiesService, enrollmentsService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  attendanceStatusLabels,
  buildRosterSummary,
  mapEnrollmentRow
} from "../../services/mappers/enrollmentsMapper";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import "./ClassRosterModal.css";

const attendanceOptions = [
  { value: "PENDING", label: attendanceStatusLabels.PENDING.label },
  { value: "ATTENDED", label: attendanceStatusLabels.ATTENDED.label },
  { value: "ABSENT", label: attendanceStatusLabels.ABSENT.label }
];

function calculateFinalPrice(base, discount) {
  const price = Number(base || 0);
  const pct = Number(discount || 0);
  if (!price || pct <= 0) return price;
  const clamped = Math.min(Math.max(pct, 0), 100);
  return Math.round(price * (1 - clamped / 100) * 100) / 100;
}

function PaymentEditor({ activity, row, onCancel, onSave, isSaving }) {
  const [discount, setDiscount] = useState(
    row.discountApplied != null ? String(row.discountApplied) : "0"
  );
  const [pricePaid, setPricePaid] = useState(
    row.pricePaid != null
      ? String(row.pricePaid)
      : String(calculateFinalPrice(activity.price, 0))
  );
  const [autoCalc, setAutoCalc] = useState(true);

  useEffect(() => {
    if (!autoCalc) return;
    setPricePaid(String(calculateFinalPrice(activity.price, discount)));
  }, [activity.price, autoCalc, discount]);

  const handleSubmit = () => {
    const priceValue = Number(pricePaid);
    const discountValue = Number(discount);
    onSave({
      paid: true,
      pricePaid: Number.isFinite(priceValue) ? priceValue : null,
      discountApplied: Number.isFinite(discountValue) ? discountValue : null
    });
  };

  return (
    <div className="roster-pay-form">
      <div className="roster-pay-form__row">
        <label className="roster-pay-form__field">
          <span>Descuento %</span>
          <input
            max="100"
            min="0"
            onChange={(event) => {
              setDiscount(event.target.value);
              setAutoCalc(true);
            }}
            step="1"
            type="number"
            value={discount}
          />
        </label>
        <label className="roster-pay-form__field">
          <span>Importe cobrado</span>
          <input
            min="0"
            onChange={(event) => {
              setPricePaid(event.target.value);
              setAutoCalc(false);
            }}
            step="0.01"
            type="number"
            value={pricePaid}
          />
        </label>
      </div>
      <p className="roster-pay-form__helper">
        Precio base: {formatCurrency(activity.price)}. El importe se recalcula
        al cambiar el descuento salvo que lo edites manualmente.
      </p>
      <div className="roster-pay-form__actions">
        <Button onClick={onCancel} size="sm" type="button" variant="ghost">
          Cancelar
        </Button>
        <Button
          disabled={isSaving}
          onClick={handleSubmit}
          size="sm"
          type="button"
        >
          {isSaving ? "Guardando..." : "Marcar como pagado"}
        </Button>
      </div>
    </div>
  );
}

export function ClassRosterModal({ activityId, onClose }) {
  const [activity, setActivity] = useState(null);
  const [rows, setRows] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [busyKey, setBusyKey] = useState(null);
  const [actionError, setActionError] = useState("");
  const [payingUserId, setPayingUserId] = useState(null);

  useEffect(() => {
    if (!activityId) return;

    let ignore = false;
    setLoadState("loading");
    setLoadError("");

    Promise.all([
      activitiesService.getById(activityId),
      enrollmentsService.listByActivity(activityId)
    ])
      .then(([activityRes, enrollmentsRes]) => {
        if (ignore) return;
        setActivity(activityRes);
        setRows(enrollmentsRes.map(mapEnrollmentRow));
        setLoadState("success");
      })
      .catch((error) => {
        if (ignore) return;
        setLoadError(
          getApiErrorMessage(error, "No se pudo cargar la lista de alumnos.")
        );
        setLoadState("error");
      });

    return () => {
      ignore = true;
    };
  }, [activityId]);

  const summary = useMemo(
    () => buildRosterSummary(rows, activity?.price ?? 0),
    [rows, activity]
  );

  const applyUpdate = (userId, updatedEnrollment) => {
    const mapped = mapEnrollmentRow(updatedEnrollment);
    setRows((current) =>
      current.map((row) => (row.userId === userId ? mapped : row))
    );
  };

  const handleAttendanceChange = async (row, nextStatus) => {
    if (row.attendanceStatus === nextStatus) return;
    setBusyKey(`attendance-${row.userId}`);
    setActionError("");
    try {
      const updated = await enrollmentsService.update(
        row.activityId,
        row.userId,
        { attendanceStatus: nextStatus }
      );
      applyUpdate(row.userId, updated);
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "No se pudo actualizar la asistencia.")
      );
    } finally {
      setBusyKey(null);
    }
  };

  const handleSavePayment = async (row, payload) => {
    setBusyKey(`pay-${row.userId}`);
    setActionError("");
    try {
      const updated = await enrollmentsService.update(
        row.activityId,
        row.userId,
        payload
      );
      applyUpdate(row.userId, updated);
      setPayingUserId(null);
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "No se pudo registrar el cobro.")
      );
    } finally {
      setBusyKey(null);
    }
  };

  const handleMarkUnpaid = async (row) => {
    setBusyKey(`pay-${row.userId}`);
    setActionError("");
    try {
      const updated = await enrollmentsService.update(
        row.activityId,
        row.userId,
        { paid: false, pricePaid: null }
      );
      applyUpdate(row.userId, updated);
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "No se pudo revertir el cobro.")
      );
    } finally {
      setBusyKey(null);
    }
  };

  const handleCancel = async (row) => {
    const confirmed = window.confirm(
      `Cancelar la inscripción de ${row.userFullName}? Se guardará el histórico.`
    );
    if (!confirmed) return;

    setBusyKey(`cancel-${row.userId}`);
    setActionError("");
    try {
      const updated = await enrollmentsService.cancel(
        row.activityId,
        row.userId
      );
      applyUpdate(row.userId, updated);
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "No se pudo cancelar la inscripción.")
      );
    } finally {
      setBusyKey(null);
    }
  };

  const handleNotesBlur = async (row, notes) => {
    if ((row.notes ?? "") === notes) return;
    setBusyKey(`notes-${row.userId}`);
    setActionError("");
    try {
      const updated = await enrollmentsService.update(
        row.activityId,
        row.userId,
        { notes }
      );
      applyUpdate(row.userId, updated);
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "No se pudieron guardar las notas.")
      );
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <Modal
      description={
        activity
          ? `${formatDateTime(activity.date)} — precio base ${formatCurrency(activity.price)}`
          : "Gestiona el cobro y la asistencia de la sesión."
      }
      onClose={onClose}
      size="xl"
      title={activity ? `Lista de alumnos · ${activity.title}` : "Lista de alumnos"}
    >
      {loadState === "loading" ? (
        <LoadingState lines={5} />
      ) : loadState === "error" ? (
        <EmptyState
          description={loadError}
          icon="warning"
          title="No se pudo cargar la sesión"
        />
      ) : (
        <div className="roster">
          <div className="roster__summary">
            <div className="roster__metric">
              <span>Inscritos</span>
              <strong>{summary.active}</strong>
              <small>{summary.total} incluidos cancelados</small>
            </div>
            <div className="roster__metric">
              <span>Cobros realizados</span>
              <strong>{summary.paid}</strong>
              <small>{summary.revenueRealLabel} ingresados</small>
            </div>
            <div className="roster__metric">
              <span>Pendiente de cobro</span>
              <strong>{summary.pendingRevenueLabel}</strong>
              <small>{summary.active - summary.paid} alumnos</small>
            </div>
            <div className="roster__metric">
              <span>Asistencias marcadas</span>
              <strong>{summary.attended}</strong>
              <small>de {summary.active} activos</small>
            </div>
          </div>

          {actionError ? (
            <div className="roster__error">
              <Icon name="warning" size={14} />
              {actionError}
            </div>
          ) : null}

          {rows.length ? (
            <div className="roster__table-wrap">
              <table className="roster__table">
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Pago</th>
                    <th>Asistencia</th>
                    <th>Notas</th>
                    <th aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const isPayingThis = payingUserId === row.userId;
                    return (
                      <tr
                        className={row.isCancelled ? "roster__row--cancelled" : ""}
                        key={row.userId}
                      >
                        <td>
                          <strong>{row.userFullName}</strong>
                          {row.isCancelled ? (
                            <div className="roster__row-sub">
                              <StatusBadge label="Cancelada" tone="attention" />
                            </div>
                          ) : null}
                        </td>
                        <td>
                          {row.paid ? (
                            <div className="roster__pay-cell">
                              <StatusBadge label="Pagado" tone="active" />
                              <span className="roster__pay-amount">
                                {row.pricePaidLabel}
                                {row.discountApplied != null &&
                                row.discountApplied > 0
                                  ? ` · -${row.discountApplied}%`
                                  : ""}
                              </span>
                              {!row.isCancelled ? (
                                <button
                                  className="roster__link-btn"
                                  disabled={busyKey === `pay-${row.userId}`}
                                  onClick={() => handleMarkUnpaid(row)}
                                  type="button"
                                >
                                  Revertir
                                </button>
                              ) : null}
                            </div>
                          ) : (
                            <div className="roster__pay-cell">
                              <StatusBadge label="Sin pagar" tone="inactive" />
                              {!row.isCancelled ? (
                                isPayingThis ? (
                                  <PaymentEditor
                                    activity={activity}
                                    isSaving={busyKey === `pay-${row.userId}`}
                                    onCancel={() => setPayingUserId(null)}
                                    onSave={(payload) =>
                                      handleSavePayment(row, payload)
                                    }
                                    row={row}
                                  />
                                ) : (
                                  <button
                                    className="roster__link-btn roster__link-btn--primary"
                                    onClick={() => setPayingUserId(row.userId)}
                                    type="button"
                                  >
                                    Cobrar
                                  </button>
                                )
                              ) : null}
                            </div>
                          )}
                        </td>
                        <td>
                          <select
                            className="roster__select"
                            disabled={
                              row.isCancelled ||
                              busyKey === `attendance-${row.userId}`
                            }
                            onChange={(event) =>
                              handleAttendanceChange(row, event.target.value)
                            }
                            value={row.attendanceStatus}
                          >
                            {attendanceOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                            {row.attendanceStatus === "CANCELLED" ? (
                              <option value="CANCELLED">
                                {attendanceStatusLabels.CANCELLED.label}
                              </option>
                            ) : null}
                          </select>
                        </td>
                        <td>
                          <textarea
                            className="roster__notes"
                            defaultValue={row.notes}
                            disabled={row.isCancelled}
                            onBlur={(event) =>
                              handleNotesBlur(row, event.target.value)
                            }
                            placeholder="Notas internas..."
                            rows={2}
                          />
                        </td>
                        <td>
                          {!row.isCancelled ? (
                            <button
                              aria-label={`Cancelar inscripción de ${row.userFullName}`}
                              className="roster__cancel-btn"
                              disabled={busyKey === `cancel-${row.userId}`}
                              onClick={() => handleCancel(row)}
                              type="button"
                            >
                              <Icon name="close" size={14} />
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              description="Todavía no hay alumnos apuntados a esta sesión."
              icon="users"
              title="Sin inscripciones"
            />
          )}
        </div>
      )}
    </Modal>
  );
}
