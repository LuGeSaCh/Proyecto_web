import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        if (!email || !password) {
            setError("Por favor, completa ambos campos.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/login", {
                correo: email,
                contrasenia: password
            });

            login(response.data, response.data.token);

            alert(`¡Bienvenido de nuevo, ${response.data.nombre}!`);
            navigate("/");

        } catch (err) {
            console.error("Error en login:", err);
            const msg = err.response?.data?.message 
                ? (Array.isArray(err.response.data.message) ? err.response.data.message.join(", ") : err.response.data.message)
                : "Credenciales incorrectas.";
            setError(msg);
        }
    };
    return (
        <div className="login-container">
             <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
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
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Ingresar
                </button>

                <p className="signup-link">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/signup">Regístrate aquí</Link>
                </p>
            </form>
        </div>
    );
}
export default LoginPage;