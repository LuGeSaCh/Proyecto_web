import React, { useEffect, useState, useRef } from "react"; // 1. Importamos useRef
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmailPage.css";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const processed = useRef(false); //para evitar doble ejecución

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    if (processed.current) return;
    processed.current = true; 

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
  }, [searchParams, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === "verifying" && (
          <>
            <h2>Verificando tu correo...</h2>
            <div className="spinner"></div>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="success-text">¡Cuenta Verificada!</h2>
            <p>Tu correo ha sido confirmado exitosamente.</p>
            <p>Redirigiendo al inicio de sesión...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="error-text">Error o Enlace Expirado</h2>
            <p>Es posible que tu cuenta ya haya sido verificada o el enlace no sirva.</p>
            <p>Intenta iniciar sesión para comprobarlo.</p>
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