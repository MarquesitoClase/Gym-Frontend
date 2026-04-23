import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const success = login(email, password);

    if (success) {
      navigate("/", { replace: true });
    } else {
      setError(t("login.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <img alt="TenFit" className="login-card__logo-img" src="/logo.png" />
          <p className="login-card__subtitle">{t("login.subtitle")}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error ? (
            <div className="login-form__error">{error}</div>
          ) : null}

          <label className="login-form__field">
            <span className="login-form__label">{t("login.email")}</span>
            <input
              autoComplete="email"
              autoFocus
              className="login-form__input"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tenfit.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="login-form__field">
            <span className="login-form__label">{t("login.password")}</span>
            <input
              autoComplete="current-password"
              className="login-form__input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </label>

          <button
            className="login-form__submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? t("login.submitting") : t("login.submit")}
          </button>
        </form>

        <p className="login-card__hint">{t("login.hint")}</p>
      </div>
    </div>
  );
}
