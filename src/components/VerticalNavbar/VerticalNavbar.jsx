import React from 'react';
import './VerticalNavbar.css';

export default function VerticalNavbar() {
  return (
    <nav className="verticalNavbar">
      <section>
        <h1>TITAN GYM</h1>
        <p class="subtitle">Admin terminal</p>
      </section>

      <section>  
        <a href="#Dashboard">Dashboard</a>
        <a href="#Members">Miembros</a>
        <a href="#Teachers">Profesores</a>
        <a href="#Activities">Actividades</a>
      </section>

      <section>
        <button>Registro rápido</button>
      </section>
      <section>
        <a href="#Settings">Configuración</a>
        <a href="#Logout">Cerrar sesión</a>
      </section>
    </nav>
  );
}
