import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return <div className="loading-text">Cargando perfil...</div>;

  return (
    <div className="profile-wrapper">
      {/* Sección Superior: Información del Usuario */}
      <div className="profile-header-card">
        <div className="profile-text-content">
          <h1 className="user-name">{user.nombre}</h1>
          <p className="user-location">
            📍 {user.municipio}, {user.departamento}
          </p>
          <div className="user-meta">
            <span className="user-email">{user.correo}</span>
            <span className="user-role-badge">{user.rol}</span>
          </div>
        </div>
        
        <div className="profile-header-actions">
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Sección de Estadísticas (Dashboard) */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Rentas Totales</h3>
            <p className="stat-number">0</p> {/* Aquí podrías conectar el historial real */}
          </div>
          <div className="stat-icon">🚗</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>En Curso</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-icon">🔑</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Soporte</h3>
            <p className="stat-number">Ayuda</p>
          </div>
          <div className="stat-icon">❓</div>
        </div>
      </div>

      {/* Botón de Acción Principal */}
      <div className="action-area">
        <button className="view-rentals-btn" onClick={() => console.log("Ir a mis rentas")}>
          Ver mis rentas
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;