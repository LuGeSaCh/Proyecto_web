
import React from "react";
import "./navBar.css"; 

function navBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          Rentados 🚗
        </a>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="#catalog" className="navbar-link">Catálogo</a>
          </li>
          <li className="navbar-item">
            <a href="#about" className="navbar-link">Nosotros</a>
          </li>
          <li className="navbar-item">
            <a href="#login" className="navbar-link navbar-button">Iniciar Sesión</a>
          </li>
          <li className="navbar-item">
            <a href="#signup" className="navbar-link navbar-button navbar-button-primary">Registrarse</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default navBar;