import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button/Button";
import { LoadingState } from "../../components/LoadingState/LoadingState";
import { Modal } from "../../components/Modal/Modal";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";

function toLocalDateTimeString(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function generateDates(baseDate, freq, count) {
  const dates = [];
  for (let i = 1; i <= count; i++) {
    const next = new Date(baseDate);
    if (freq === "weekly") {
      next.setDate(baseDate.getDate() + 7 * i);
    } else {
      // 2x/semana: lun+jue pattern (+3, +4, +3, +4...)
      const daysOffset = Math.ceil(i / 2) * 3 + Math.floor(i / 2) * 4;
      next.setDate(baseDate.getDate() + daysOffset);
    }
    dates.push(toLocalDateTimeString(next));
  }
  return dates;
}

function getCurrentDateTimeLocal() {
  return toLocalDateTimeString(new Date());
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
  const [imageFile, setImageFile] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [additionalDates, setAdditionalDates] = useState([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorFreq, setGeneratorFreq] = useState("weekly");
  const [generatorCount, setGeneratorCount] = useState(4);

  useEffect(() => {
    let ignore = false;

    async function loadFormContext() {
      setIsFetching(true);
      setSubmitError("");

      try {
        const teachers = await teachersService.list();

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
            teacherId: String(activity.teacherId ?? ""),
            title: activity.title ?? ""
          });
          setImageFile(null);
          setPreviewUrl(activity.imageUrl ?? "");
        } else {
          setFormValues({
            ...initialFormState,
            teacherId: teachers[0]?.id ? String(teachers[0].id) : ""
          });
          setImageFile(null);
          setPreviewUrl("");
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

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

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

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    setImageFile(nextFile);

    if (!nextFile && !formValues.imageUrl) {
      setPreviewUrl("");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    setFormValues((currentValues) => ({
      ...currentValues,
      imageUrl: ""
    }));
  };

  const addExtraDate = () => {
    const base = formValues.date || getCurrentDateTimeLocal();
    const next = new Date(normalizeDateTimeValue(base));
    next.setDate(next.getDate() + 7);
    setAdditionalDates((current) => [...current, toLocalDateTimeString(next)]);
  };

  const removeExtraDate = (index) => {
    setAdditionalDates((current) => current.filter((_, i) => i !== index));
  };

  const updateExtraDate = (index, value) => {
    setAdditionalDates((current) =>
      current.map((d, i) => (i === index ? value : d))
    );
  };

  const handleGenerate = () => {
    const base = new Date(normalizeDateTimeValue(formValues.date || getCurrentDateTimeLocal()));
    const generated = generateDates(base, generatorFreq, generatorCount);
    setAdditionalDates((current) => [...current, ...generated]);
    setShowGenerator(false);
  };

  function buildExtraPayload(date) {
    const p = new FormData();
    p.append("title", formValues.title.trim());
    p.append("description", formValues.description.trim());
    p.append("date", normalizeDateTimeValue(date));
    p.append("price", formValues.price);
    p.append("teacherId", formValues.teacherId);
    p.append("imageUrl", formValues.imageUrl.trim());
    if (imageFile) {
      p.append("image", imageFile);
    }
    return p;
  }

  const handleSubmit = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    if (!formValues.teacherId) {
      setSubmitError("Selecciona un monitor antes de guardar.");
      return;
    }

    if (!formValues.title.trim()) {
      setSubmitError("El titulo no puede estar vacio.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = new FormData();
      payload.append("title", formValues.title.trim());
      payload.append("description", formValues.description.trim());
      payload.append("date", normalizeDateTimeValue(formValues.date));
      payload.append("price", formValues.price);
      payload.append("teacherId", formValues.teacherId);
      payload.append("imageUrl", formValues.imageUrl.trim());

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (mode === "edit" && activityId) {
        await activitiesService.update(activityId, payload);
      } else {
        await activitiesService.create(payload);
      }

      for (const extraDate of additionalDates) {
        await activitiesService.create(buildExtraPayload(extraDate));
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

  const totalSessions = 1 + additionalDates.length;

  const submitLabel = isSubmitting
    ? additionalDates.length > 0
      ? `Creando ${totalSessions} sesiones...`
      : mode === "edit"
      ? "Guardando..."
      : "Creando..."
    : additionalDates.length > 0
    ? mode === "edit"
      ? `Guardar y añadir ${additionalDates.length} sesión${additionalDates.length > 1 ? "es" : ""}`
      : `Crear ${totalSessions} sesiones`
    : modalCopy.submitLabel;

  return (
    <Modal
      description={modalCopy.description}
      onClose={onClose}
      title={modalCopy.title}
    >
      {isFetching ? (
        <LoadingState lines={5} />
      ) : (
        <form className="entity-form" noValidate onSubmit={handleSubmit}>
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
              <span className="entity-form__label">
                {mode === "create" ? "Primera sesión" : "Fecha y hora"}
              </span>
              <input
                className="entity-form__control"
                min={mode === "create" ? getCurrentDateTimeLocal() : undefined}
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
              <span className="entity-form__label">Imagen</span>
              <input
                accept="image/*"
                className="entity-form__control"
                onChange={handleImageChange}
                type="file"
              />
              <span className="entity-form__file-name">
                {imageFile ? imageFile.name : "Puedes dejarlo vacio si no quieres subir imagen."}
              </span>
            </label>
          </div>

          <div className="entity-form__extra-dates">
            <div className="entity-form__extra-dates-header">
              <strong className="entity-form__section-title">
                Sesiones adicionales
                {additionalDates.length > 0 ? (
                  <span className="entity-form__extra-dates-count">
                    {additionalDates.length}
                  </span>
                ) : null}
              </strong>
              <div className="entity-form__extra-dates-actions">
                <button
                  className="entity-form__add-date-btn"
                  onClick={() => setShowGenerator((v) => !v)}
                  type="button"
                >
                  Generar automáticamente
                </button>
                <button
                  className="entity-form__add-date-btn entity-form__add-date-btn--primary"
                  onClick={addExtraDate}
                  type="button"
                >
                  + Añadir fecha
                </button>
              </div>
            </div>

            {showGenerator ? (
              <div className="entity-form__recurring-options">
                <div className="entity-form__recurring-row">
                  <label className="entity-form__field">
                    <span className="entity-form__label">Frecuencia</span>
                    <select
                      className="entity-form__control"
                      onChange={(e) => setGeneratorFreq(e.target.value)}
                      value={generatorFreq}
                    >
                      <option value="weekly">1 vez por semana</option>
                      <option value="biweekly">2 veces por semana</option>
                    </select>
                  </label>
                  <label className="entity-form__field">
                    <span className="entity-form__label">Número de sesiones</span>
                    <input
                      className="entity-form__control"
                      max="24"
                      min="1"
                      onChange={(e) => setGeneratorCount(Number(e.target.value))}
                      type="number"
                      value={generatorCount}
                    />
                  </label>
                </div>
                <p className="entity-form__helper">
                  Se añadirán <strong>{generatorCount} fechas</strong> a la lista
                  — {generatorFreq === "weekly" ? "cada 7 días" : "patrón lun/jue (3-4 días)"}
                  . Podrás ajustarlas antes de guardar.
                </p>
                <div className="entity-form__recurring-actions">
                  <Button onClick={handleGenerate} size="sm" type="button">
                    Añadir {generatorCount} fechas
                  </Button>
                  <Button
                    onClick={() => setShowGenerator(false)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : null}

            {additionalDates.length ? (
              <ul className="entity-form__extra-dates-list">
                {additionalDates.map((date, index) => (
                  <li className="entity-form__extra-date-item" key={index}>
                    <span className="entity-form__extra-date-num">{index + 2}</span>
                    <input
                      className="entity-form__control"
                      onChange={(e) => updateExtraDate(index, e.target.value)}
                      type="datetime-local"
                      value={date}
                    />
                    <button
                      aria-label="Eliminar fecha"
                      className="entity-form__unenroll-btn"
                      onClick={() => removeExtraDate(index)}
                      type="button"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="entity-form__helper">
                Añade fechas manualmente o usa el generador automático para
                programar varias sesiones de golpe.
              </p>
            )}
          </div>

          {previewUrl ? (
            <div className="entity-form__preview">
              <img alt="Vista previa de la actividad" src={previewUrl} />
              <div className="entity-form__preview-copy">
                <strong>Portada preparada</strong>
                <span>
                  {imageFile
                    ? "Se subira una nueva imagen al guardar."
                    : "Se mantendra la imagen actual de la actividad."}
                </span>
                <Button onClick={handleRemoveImage} size="sm" variant="ghost">
                  Quitar imagen
                </Button>
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
                  La imagen se sube a traves del backend.
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
                disabled={isDeleting || isSubmitting}
                onClick={handleSubmit}
                type="button"
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
