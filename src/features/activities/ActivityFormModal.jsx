import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { Modal } from "../../components/ui/Modal";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";

function getCurrentDateTimeLocal() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function formatDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
}

function normalizeDateTimeValue(value) {
  return value.length === 16 ? `${value}:00` : value;
}

const initialFormState = {
  date: getCurrentDateTimeLocal(),
  description: "",
  imageUrl: "",
  price: "",
  teacherId: "",
  title: ""
};

export function ActivityFormModal({ activityId, mode, onClose, onSuccess }) {
  const [activeTeachers, setActiveTeachers] = useState([]);
  const [formValues, setFormValues] = useState(initialFormState);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadFormContext() {
      setIsFetching(true);
      setSubmitError("");

      try {
        const teachers = await teachersService.listActive();

        if (ignore) {
          return;
        }

        setActiveTeachers(teachers);

        if (mode === "edit" && activityId) {
          const activity = await activitiesService.getById(activityId);

          if (ignore) {
            return;
          }

          setFormValues({
            date: formatDateTimeLocal(activity.date),
            description: activity.description ?? "",
            imageUrl: activity.imageUrl ?? "",
            price:
              activity.price === null || activity.price === undefined
                ? ""
                : String(activity.price),
            teacherId: String(activity.teacher?.id ?? ""),
            title: activity.title ?? ""
          });
        } else {
          setFormValues({
            ...initialFormState,
            teacherId: teachers[0]?.id ? String(teachers[0].id) : ""
          });
        }
      } catch (error) {
        if (ignore) {
          return;
        }

        setSubmitError(
          getApiErrorMessage(
            error,
            "No se pudo cargar la informacion necesaria para editar la actividad."
          )
        );
      } finally {
        if (!ignore) {
          setIsFetching(false);
        }
      }
    }

    loadFormContext();

    return () => {
      ignore = true;
    };
  }, [activityId, mode]);

  const modalCopy = useMemo(() => {
    if (mode === "edit") {
      return {
        description:
          "Actualiza los datos visibles de la sesion y su monitor asignado.",
        submitLabel: "Guardar cambios",
        title: "Editar actividad"
      };
    }

    return {
      description:
        "Crea una nueva actividad futura con el contrato JSON real del backend.",
      submitLabel: "Crear actividad",
      title: "Nueva actividad"
    };
  }, [mode]);

  const handleChange = (field) => (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        date: normalizeDateTimeValue(formValues.date),
        description: formValues.description.trim(),
        imageUrl: formValues.imageUrl.trim(),
        price: Number(formValues.price),
        teacherId: Number(formValues.teacherId),
        title: formValues.title.trim()
      };

      if (mode === "edit" && activityId) {
        await activitiesService.update(activityId, payload);
      } else {
        await activitiesService.create(payload);
      }

      onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "No se pudo guardar la actividad.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!activityId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Se va a eliminar esta actividad de forma permanente. ¿Quieres continuar?"
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    setSubmitError("");

    try {
      await activitiesService.remove(activityId);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "No se pudo eliminar la actividad.")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      description={modalCopy.description}
      onClose={onClose}
      title={modalCopy.title}
    >
      {isFetching ? (
        <LoadingState lines={5} />
      ) : (
        <form className="entity-form" onSubmit={handleSubmit}>
          {submitError ? (
            <div className="entity-form__error">{submitError}</div>
          ) : null}

          <div className="entity-form__grid">
            <label className="entity-form__field">
              <span className="entity-form__label">Titulo</span>
              <input
                className="entity-form__control"
                onChange={handleChange("title")}
                required
                type="text"
                value={formValues.title}
              />
            </label>

            <label className="entity-form__field">
              <span className="entity-form__label">Monitor</span>
              <select
                className="entity-form__control"
                onChange={handleChange("teacherId")}
                required
                value={formValues.teacherId}
              >
                <option value="">Selecciona un monitor</option>
                {activeTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {[teacher.firstName, teacher.lastName].filter(Boolean).join(" ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="entity-form__field entity-form__field--full">
              <span className="entity-form__label">Descripcion</span>
              <textarea
                className="entity-form__textarea"
                onChange={handleChange("description")}
                required
                rows={4}
                value={formValues.description}
              />
            </label>

            <label className="entity-form__field">
              <span className="entity-form__label">Precio</span>
              <input
                className="entity-form__control"
                min="0"
                onChange={handleChange("price")}
                required
                step="0.01"
                type="number"
                value={formValues.price}
              />
            </label>

            <label className="entity-form__field">
              <span className="entity-form__label">Fecha y hora</span>
              <input
                className="entity-form__control"
                min={getCurrentDateTimeLocal()}
                onChange={handleChange("date")}
                required
                type="datetime-local"
                value={formValues.date}
              />
              <span className="entity-form__helper">
                Solo las actividades futuras apareceran en el catalogo.
              </span>
            </label>

            <label className="entity-form__field entity-form__field--full">
              <span className="entity-form__label">URL de imagen</span>
              <input
                className="entity-form__control"
                onChange={handleChange("imageUrl")}
                placeholder="https://..."
                type="url"
                value={formValues.imageUrl}
              />
              <span className="entity-form__helper">
                El backend espera una URL directa de imagen para actividades.
              </span>
            </label>
          </div>

          {formValues.imageUrl ? (
            <div className="entity-form__preview">
              <img alt="Vista previa de la actividad" src={formValues.imageUrl} />
              <div className="entity-form__preview-copy">
                <strong>Portada configurada</strong>
                <span>Se mostrara en la tarjeta del catalogo.</span>
              </div>
            </div>
          ) : null}

          <div className="entity-form__actions">
            <div className="entity-form__actions-group">
              {mode === "edit" ? (
                <button
                  className="entity-form__danger"
                  disabled={isDeleting || isSubmitting}
                  onClick={handleDelete}
                  type="button"
                >
                  {isDeleting ? "Eliminando..." : "Eliminar actividad"}
                </button>
              ) : (
                <span className="entity-form__helper">
                  Elige un monitor activo antes de guardar.
                </span>
              )}
            </div>

            <div className="entity-form__actions-group">
              <Button
                disabled={isDeleting || isSubmitting}
                onClick={onClose}
                type="button"
                variant="ghost"
              >
                Cancelar
              </Button>
              <Button
                disabled={
                  isDeleting ||
                  isSubmitting ||
                  !formValues.teacherId ||
                  !activeTeachers.length
                }
                type="submit"
              >
                {isSubmitting ? "Guardando..." : modalCopy.submitLabel}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
