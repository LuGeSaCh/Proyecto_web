import React from "react";
import { Link } from "react-router-dom";
import "./navBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Rentados
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Catálogo
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/nosotros" className="navbar-link">
              Nosotros
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/login" className="navbar-link navbar-button">
              Iniciar Sesión
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/signup"
              className="navbar-link navbar-button navbar-button-primary"
            >
              Registrarse
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
