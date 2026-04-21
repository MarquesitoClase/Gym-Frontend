import "./ConfigPage.css";
import { useState } from "react";

export function ConfigPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="config-page">
      <h1 className="config-title">Configuración</h1>

      {/* Perfil */}
      <section className="config-section">
        <h2>Perfil</h2>
        <div className="config-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </section>

      {/* Preferencias */}
      <section className="config-section">
        <h2>Preferencias</h2>
        <div className="config-field config-toggle">
          <label>Modo oscuro</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </section>

      {/* Acciones */}
      <section className="config-section">
        <h2>Acciones</h2>
        <button className="config-btn save">Guardar cambios</button>
        <button className="config-btn logout">Cerrar sesión</button>
      </section>
    </div>
  );
}