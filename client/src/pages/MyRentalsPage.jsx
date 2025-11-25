import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyRentalsPage.css";

function MyRentalsPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:3001/api/rentals", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRentals(res.data);
            } catch (error) {
                console.error("Error cargando rentas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    if (loading) return <div className="loading-container">Cargando historial...</div>;

    return (
        <div className="my-rentals-container">
            <h2>Mi Historial de Rentas</h2>

            {rentals.length === 0 ? (
                <p className="no-rentals">Aún no has realizado ninguna renta.</p>
            ) : (
                <div className="rentals-list">
                    {rentals.map((rental) => (
                        <div key={rental.id} className="rental-item-card">
                            <img src={rental.imagenURL} alt={rental.modelo} className="rental-img" />

                            <div className="rental-info">
                                <h3>{rental.marca} {rental.modelo} ({rental.anio})</h3>
                                <p>📅 <strong>Desde:</strong> {new Date(rental.fechaInicio).toLocaleDateString()}</p>
                                <p>📅 <strong>Hasta:</strong> {new Date(rental.fechaFin).toLocaleDateString()}</p>
                                <p>💰 <strong>Total:</strong> ${rental.precioTotal}</p>
                            </div>

                            <div className={`rental-status status-${rental.estado}`}>
                                {rental.estado.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRentalsPage;