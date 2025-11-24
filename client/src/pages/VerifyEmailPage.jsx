import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmailPage.css";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");

  const [status, setStatus] = useState("waiting");

  useEffect(() => {
    if (!token) {
      setStatus("error");
    }
  }, [token]);

  const handleConfirm = () => {
    setStatus("verifying"); 

    axios.post("http://localhost:3001/api/verify-email", { token })
      .then((response) => {
        console.log(response.data);
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        
        {status === "waiting" && (
          <>
            <h2>Confirma tu verificación</h2>
            <p>Estás a un paso de activar tu cuenta en <strong>Rentados</strong>.</p>
            <p>Haz clic en el botón de abajo para validar tu correo electrónico.</p>
            
            <div className="verify-actions">
                <button onClick={handleConfirm} className="verify-button confirm-btn">
                Confirmar Cuenta
                </button>
                <button onClick={handleCancel} className="verify-button cancel-btn">
                Cancelar
                </button>
            </div>
          </>
        )}

        {status === "verifying" && (
          <>
            <h2>Verificando...</h2>
            <div className="spinner"></div>
            <p>Por favor espera un momento.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="success-text">¡Cuenta Verificada!</h2>
            <p>Tu correo ha sido confirmado exitosamente.</p>
            <p className="redirect-text">Redirigiendo al inicio de sesión...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="error-text">Enlace no váli do</h2>
            <p>Este enlace de verificación es inválido o ya ha expirado.</p>
            <button onClick={() => navigate("/login")} className="verify-button">
              Ir al Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;