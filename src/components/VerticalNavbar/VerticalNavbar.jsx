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
          <li><a href="#Dashboard">Dashboard</a></li>
          <li><a href="#Members">Miembros</a></li>
          <li><a href="#Teachers">Profesores</a></li>
          <li><a href="#Activities">Actividades</a></li>
        </ul>
        
      </section>

      <section>
        <button type="button">Registro rápido</button>
      </section>

      <section className="footer">
        <a href="#Settings" id="settings-link">{/*magen de rawpixel.com en Freepik*/}⚙️Configuración</a><br></br>
        <a href="#Logout" id="logout-link">{/**/}<img src="src/resources/img/logout.png" title="icono logout" alt="Cerrar sesión"></img>Cerrar sesión</a>
      </section>
    </nav>
  );
}
