import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.css"; // Estilos especificos para esta página

function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        // 1. Validacion de campos vacíos
        if (!name || !email || !password || !confirmPassword) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        // 2. Validacion de contraseñas
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        // 3. Validacion de longitud de contraseña (ejemplo)
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // --- TODO: Logica de Registro ---
        // Aqui es donde llamarias a tu backend (API) para crear el nuevo usuario
        // Por ahora, solo simularemos un registro exitoso
        console.log("Registrando usuario con:", { name, email, password });

        // Simulación de éxito
        alert("¡Registro exitoso! (Simulación). Ahora puedes iniciar sesión.");

        // Redirigir a la pag de login despues del registro
        navigate("/login");
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Crear Cuenta</h2>

                {/* Mostrar mensaje de error si existe */}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="name">Nombre Completo</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
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

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="signup-button">
                    Registrarse
                </button>

                <p className="login-link">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                </p>
            </form>
        </div>
    );
}

export default SignupPage;