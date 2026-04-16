import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { Modal } from "../../components/ui/Modal";
import {
  activitiesService,
  enrollmentsService,
  usersService
} from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import { formatDateTime } from "../../utils/formatters";

const initialFormState = {
  active: true,
  dni: "",
  firstName: "",
  imageUrl: "",
  lastName: "",
  registrationYear: String(new Date().getFullYear())
};

export function UserFormModal({ mode, onClose, onSuccess, userId }) {
  const [formValues, setFormValues] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Inscripciones (solo modo edicion)
  const [enrollments, setEnrollments] = useState([]);
  const [enrollActivities, setEnrollActivities] = useState([]);
  const [selectedEnrollId, setSelectedEnrollId] = useState("");
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState(null);
  const [deletingEnrollId, setDeletingEnrollId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      if (mode !== "edit" || !userId) {
        setFormValues(initialFormState);
        setImageFile(null);
        setIsFetching(false);
        setPreviewUrl("");
        setSubmitError("");
        return;
      }

      setIsFetching(true);
      setSubmitError("");

      try {
        const user = await usersService.getById(userId);

        if (ignore) {
          return;
        }

        setFormValues({
          active: Boolean(user.active),
          dni: user.dni ?? "",
          firstName: user.firstName ?? "",
          imageUrl: user.imageUrl ?? "",
          lastName: user.lastName ?? "",
          registrationYear: user.registrationYear
            ? String(user.registrationYear)
            : ""
        });
        setImageFile(null);
        setPreviewUrl(user.imageUrl ?? "");
      } catch (error) {
        if (ignore) {
          return;
        }

        setSubmitError(
          getApiErrorMessage(error, "No se pudo cargar el usuario para editarlo.")
        );
      } finally {
        if (!ignore) {
          setIsFetching(false);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [mode, userId]);

  useEffect(() => {
    let ignore = false;
    setIsLoadingEnrollments(true);

    const promises = [
      activitiesService.list(),
      mode === "edit" && userId ? enrollmentsService.listByUser(userId) : Promise.resolve([])
    ];

    Promise.all(promises)
      .then(([activitiesResponse, enrollResponse]) => {
        if (ignore) {
          return;
        }
        setEnrollActivities(activitiesResponse);
        if (mode === "edit" && userId) {
          setEnrollments(enrollResponse);
        }
      })
      .catch(() => {
        // no bloquear el modal si falla la carga
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingEnrollments(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [mode, userId]);

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const enrolledIds = useMemo(
    () => new Set(enrollments.map((e) => e.id)),
    [enrollments]
  );

  const availableActivities = useMemo(
    () => enrollActivities.filter((a) => !enrolledIds.has(a.id)),
    [enrollActivities, enrolledIds]
  );

  const modalCopy = useMemo(() => {
    if (mode === "edit") {
      return {
        description:
          "Actualiza el estado del socio y sus datos de identificacion antes de guardar.",
        submitLabel: "Guardar cambios",
        title: "Editar usuario"
      };
    }

    return {
      description:
        "Crea un nuevo socio en la base de datos y, si quieres, sube una imagen al backend.",
      submitLabel: "Crear usuario",
      title: "Nuevo usuario"
    };
  }, [mode]);

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;

    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = new FormData();
      payload.append("firstName", formValues.firstName.trim());
      payload.append("lastName", formValues.lastName.trim());
      payload.append("dni", formValues.dni.trim());
      payload.append("registrationYear", formValues.registrationYear);
      payload.append("active", String(formValues.active));
      payload.append("imageUrl", formValues.imageUrl.trim());

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (mode === "edit" && userId) {
        await usersService.update(userId, payload);
      } else {
        const created = await usersService.create(payload);
        if (selectedEnrollId && created?.id) {
          try {
            await enrollmentsService.register(Number(selectedEnrollId), created.id);
          } catch {
            // la inscripcion fallo pero el usuario ya fue creado
          }
        }
      }

      onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "No se pudo guardar el usuario.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Se va a eliminar este usuario de forma permanente. ¿Quieres continuar?"
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    setSubmitError("");

    try {
      await usersService.remove(userId);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "No se pudo eliminar el usuario.")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUnenroll = async (activityId) => {
    if (!userId) {
      return;
    }

    setDeletingEnrollId(activityId);
    setEnrollMessage(null);

    try {
      await enrollmentsService.remove(activityId, userId);
      setEnrollments((current) => current.filter((a) => a.id !== activityId));
      setEnrollMessage({
        tone: "success",
        text: "Inscripcion cancelada correctamente."
      });
    } catch (error) {
      setEnrollMessage({
        tone: "error",
        text: getApiErrorMessage(error, "No se pudo cancelar la inscripcion.")
      });
    } finally {
      setDeletingEnrollId(null);
    }
  };

  const handleEnroll = async () => {
    if (!selectedEnrollId || !userId) {
      return;
    }

    setIsEnrolling(true);
    setEnrollMessage(null);

    try {
      await enrollmentsService.register(Number(selectedEnrollId), userId);
      const updated = await enrollmentsService.listByUser(userId);
      setEnrollments(updated);
      setSelectedEnrollId("");
      setEnrollMessage({
        tone: "success",
        text: "Inscripcion realizada correctamente."
      });
    } catch (error) {
      setEnrollMessage({
        tone: "error",
        text: getApiErrorMessage(error, "No se pudo completar la inscripcion.")
      });
    } finally {
      setIsEnrolling(false);
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
              <span className="entity-form__label">Nombre</span>
              <input
                className="entity-form__control"
                onChange={handleChange("firstName")}
                required
                type="text"
                value={formValues.firstName}
              />
            </label>

            <label className="entity-form__field">
              <span className="entity-form__label">Apellidos</span>
              <input
                className="entity-form__control"
                onChange={handleChange("lastName")}
                required
                type="text"
                value={formValues.lastName}
              />
            </label>

            <label className="entity-form__field">
              <span className="entity-form__label">DNI</span>
              <input
                className="entity-form__control"
                onChange={handleChange("dni")}
                required
                type="text"
                value={formValues.dni}
              />
            </label>

            <label className="entity-form__field">
              <span className="entity-form__label">Ano de alta</span>
              <input
                className="entity-form__control"
                min="2000"
                onChange={handleChange("registrationYear")}
                required
                type="number"
                value={formValues.registrationYear}
              />
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

            <label className="entity-form__field entity-form__field--full">
              <span className="entity-form__checkbox-row">
                <input
                  checked={formValues.active}
                  onChange={handleChange("active")}
                  type="checkbox"
                />
                Usuario activo
              </span>
            </label>
          </div>

          {previewUrl ? (
            <div className="entity-form__preview">
              <img alt="Vista previa del usuario" src={previewUrl} />
              <div className="entity-form__preview-copy">
                <strong>Imagen preparada</strong>
                <span>
                  {imageFile
                    ? "Se subira una nueva imagen a Cloudinary al guardar."
                    : "Se mantendra la imagen actual del usuario."}
                </span>
                <Button onClick={handleRemoveImage} size="sm" variant="ghost">
                  Quitar imagen
                </Button>
              </div>
            </div>
          ) : null}

          {mode === "create" ? (
            <div className="entity-form__enrollments">
              <div className="entity-form__section-divider" />
              <strong className="entity-form__section-title">
                Inscribir en actividad (opcional)
              </strong>
              {isLoadingEnrollments ? (
                <LoadingState lines={1} />
              ) : availableActivities.length ? (
                <div className="entity-form__enroll-row">
                  <select
                    className="entity-form__control"
                    onChange={(e) => setSelectedEnrollId(e.target.value)}
                    value={selectedEnrollId}
                  >
                    <option value="">Sin inscripcion inicial</option>
                    {availableActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {activity.title} — {formatDateTime(activity.date)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="entity-form__helper">
                  No hay actividades disponibles para inscribir.
                </p>
              )}
            </div>
          ) : null}

          {mode === "edit" && userId ? (
            <div className="entity-form__enrollments">
              <div className="entity-form__section-divider" />
              <strong className="entity-form__section-title">
                Inscripciones en actividades
              </strong>

              {isLoadingEnrollments ? (
                <LoadingState lines={2} />
              ) : (
                <>
                  {enrollments.length ? (
                    <ul className="entity-form__enrollment-list">
                      {enrollments.map((activity) => (
                        <li className="entity-form__enrollment-item" key={activity.id}>
                          <span className="entity-form__enrollment-name">
                            {activity.title}
                          </span>
                          <div className="entity-form__enrollment-actions">
                            <span className="entity-form__enrollment-date">
                              {formatDateTime(activity.date)}
                            </span>
                            <button
                              aria-label={`Cancelar inscripcion en ${activity.title}`}
                              className="entity-form__unenroll-btn"
                              disabled={deletingEnrollId === activity.id}
                              onClick={() => handleUnenroll(activity.id)}
                              type="button"
                            >
                              {deletingEnrollId === activity.id ? "…" : "×"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="entity-form__helper">
                      Este socio no tiene inscripciones en actividades futuras.
                    </p>
                  )}

                  {availableActivities.length ? (
                    <div className="entity-form__enroll-row">
                      <select
                        className="entity-form__control"
                        onChange={(e) => setSelectedEnrollId(e.target.value)}
                        value={selectedEnrollId}
                      >
                        <option value="">Selecciona una actividad...</option>
                        {availableActivities.map((activity) => (
                          <option key={activity.id} value={activity.id}>
                            {activity.title} — {formatDateTime(activity.date)}
                          </option>
                        ))}
                      </select>
                      <Button
                        disabled={!selectedEnrollId || isEnrolling}
                        onClick={handleEnroll}
                        size="sm"
                        type="button"
                      >
                        {isEnrolling ? "Inscribiendo..." : "Inscribir"}
                      </Button>
                    </div>
                  ) : (
                    <p className="entity-form__helper">
                      No hay actividades futuras disponibles para inscribir.
                    </p>
                  )}

                  {enrollMessage ? (
                    <div
                      className={
                        enrollMessage.tone === "success"
                          ? "entity-form__enroll-success"
                          : "entity-form__error"
                      }
                    >
                      {enrollMessage.text}
                    </div>
                  ) : null}
                </>
              )}
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
                  {isDeleting ? "Eliminando..." : "Eliminar usuario"}
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
              <Button disabled={isDeleting || isSubmitting} type="submit">
                {isSubmitting ? "Guardando..." : modalCopy.submitLabel}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
