import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de importar axios si vas a conectar con el backend
import "./SignupPage.css";
import {elSalvadorData} from "../utils/constants.js";

function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [municipio, setMunicipio] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleDepartamentoChange = (e) => {
        setDepartamento(e.target.value);
        setMunicipio(""); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validaciones
        if (!name || !email || !password || !confirmPassword || !telefono || !departamento || !municipio) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const userData = {
            nombre: name,
            correo: email,
            contrasenia: password,
            telefono: telefono,
            departamento: departamento,
            municipio: municipio
        };

        try {
            const response = await axios.post("http://localhost:3001/api/signup", userData);

            console.log("Respuesta del servidor:", response.data);
            alert("¡Registro exitoso! Revisa tu correo para verificar la cuenta.");
            navigate("/login");

        } catch (err) {
            console.error("Error en registro:", err);
            if (err.response && err.response.data && err.response.data.message) {
                const msg = Array.isArray(err.response.data.message)
                    ? err.response.data.message.join(", ")
                    : err.response.data.message;
                setError(msg);
            } else {
                setError("Ocurrió un error al registrarse. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Crear Cuenta</h2>

                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="name">Nombre Completo</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=""
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="tel"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Ej. 7777-7777"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="departamento">Departamento</label>
                    <select
                        id="departamento"
                        value={departamento}
                        onChange={handleDepartamentoChange}
                        className="filter-select"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        required
                    >
                        <option value="">Selecciona un departamento</option>
                        {Object.keys(elSalvadorData).map((dep) => (
                            <option key={dep} value={dep}>{dep}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="municipio">Municipio</label>
                    <select
                        id="municipio"
                        value={municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        required
                        disabled={!departamento}
                    >
                        <option value="">Selecciona un municipio</option>
                        {departamento && elSalvadorData[departamento].map((mun) => (
                            <option key={mun} value={mun}>{mun}</option>
                        ))}
                    </select>
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