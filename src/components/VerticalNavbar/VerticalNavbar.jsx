import "./VerticalNavbar.css";

export default function VerticalNavbar() {
  return (
    <nav className="verticalNavbar">
      <section>
        <h1>TITAN GYM</h1>
        <p className="subtitle">Admin terminal</p>
      </section>

      <section>
        <ul>
          <li><a href="/Dashboard">Dashboard</a></li>
          <li><a href="/Members">Miembros</a></li>
          <li><a href="/Teachers">Profesores</a></li>
          <li><a href="/Activities">Actividades</a></li>
        </ul>

      </section>

      <section>
        <button type="button">Registro rápido</button>
      </section>

      <section className="footer">
        {/* 
    Iconos generados por ChatGPT.
    Licencia: uso libre sin restricciones (puedes usarlos, modificarlos y distribuirlos incluso con fines comerciales).
    No requieren atribución.
  */}

        <a href="/Settings" id="settings-link">
          ⚙️ Configuración
        </a>
        <br />

        <a href="/Logout" id="logout-link">
          🚪 Cerrar sesión
        </a><br></br>

        <a href="/SignUp" id="singUp-link">
          📝 Registrarse
        </a>
      </section>
    </nav>
  );
}

