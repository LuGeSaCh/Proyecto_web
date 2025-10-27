import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook para redirigir

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        // Validacion simple
        if (!email || !password) {
            setError("Por favor, completa ambos campos.");
            return;
        }

        // Aqui es donde llamarias a tu backend (API) para verificar al usuario
        // Por ahora, solo simularemos un inicio de sesion exitoso
        console.log("Iniciando sesión con:", { email, password });

        // Simulacion de exito
        alert("¡Inicio de sesión exitoso! (Simulación)");

        // Redirigir al catalogo (pagina principal) despues del login
        navigate("/");
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                {/* Mostrar mensaje de error si existe */}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Iniciar Sesión
                </button>

                <p className="signup-link">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/signup">Regístrate</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;