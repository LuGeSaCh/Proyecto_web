import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreateCarPage.css';

function CreateCarPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Estados del formulario
    const [formData, setFormData] = useState({
        marca: "",
        modelo: "",
        anio: "",
        precioPorDia: "",
        tipoId: "", // 1: Sedán, 2: Camioneta, etc.
        imagenURL: "",
        descripcion: ""
    });

    // Tipos de vehículo (Basado en tu SQL seeders)
    const vehicleTypes = [
        { id: 1, nombre: "Sedán" },
        { id: 2, nombre: "Camioneta" },
        { id: 3, nombre: "Deportivo" },
        { id: 4, nombre: "Pick-up" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validación básica
        if (!formData.tipoId) {
            setError("Por favor selecciona un tipo de vehículo.");
            setLoading(false);
            return;
        }

        // Obtener token
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No estás autenticado.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/carros", formData, {
                headers: {
                    Authorization: `Bearer ${token}` // Importante: Enviar el token
                }
            });

            alert("¡Vehículo publicado exitosamente!");
            console.log(response.data);
            navigate("/profile"); // Redirigir al perfil para ver sus autos

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al publicar el vehículo.");
        } finally {
            setLoading(false);
        }
    };

    // Redirección si no es propietario (Opcional, también lo protege el backend)
    if (isAuthenticated && user && user.rol !== 'propietario' && user.rol !== 'admin') {
        return (
            <div className="create-car-container">
                <div className="error-message">
                    Acceso denegado. Debes tener una cuenta de "Propietario" para publicar vehículos.
                </div>
            </div>
        );
    }

    return (
        <div className="create-car-container">
            <form className="create-car-form" onSubmit={handleSubmit}>
                <h2>Publicar nuevo vehículo</h2>

                {error && <p className="error-message">{error}</p>}

                <div className="form-row">
                    <div className="form-group">
                        <label>Marca</label>
                        <input 
                            type="text" name="marca" 
                            value={formData.marca} onChange={handleChange} 
                            placeholder="Ej. Toyota" required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Modelo</label>
                        <input 
                            type="text" name="modelo" 
                            value={formData.modelo} onChange={handleChange} 
                            placeholder="Ej. Corolla" required 
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Año</label>
                        <input 
                            type="number" name="anio" 
                            value={formData.anio} onChange={handleChange} 
                            placeholder="2022" required min="1990" max={new Date().getFullYear() + 1}
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio por día ($)</label>
                        <input 
                            type="number" name="precioPorDia" 
                            value={formData.precioPorDia} onChange={handleChange} 
                            placeholder="0.00" required step="0.01"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Tipo de Vehículo</label>
                    <select name="tipoId" value={formData.tipoId} onChange={handleChange} required>
                        <option value="">Selecciona un tipo</option>
                        {vehicleTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>URL de la Imagen</label>
                    <input 
                        type="url" name="imagenURL" 
                        value={formData.imagenURL} onChange={handleChange} 
                        placeholder="https://ejemplo.com/foto-carro.jpg" required 
                    />
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea 
                        name="descripcion" 
                        value={formData.descripcion} onChange={handleChange} 
                        placeholder="Detalles importantes del vehículo (estado, extras, etc.)"
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Publicando..." : "Publicar Vehículo"}
                </button>
            </form>
        </div>
    );
}

export default CreateCarPage;