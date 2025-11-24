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

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Mi Perfil</h1>
        <div className="profile-info">
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
          <p><strong>Ubicación:</strong> {user.municipio} {user.departamento}</p>
        </div>
        
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;