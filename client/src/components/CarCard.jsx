import React from "react";

// Recibimos la nueva prop 'onSelect'
function CarCard({ car, onSelect }) {
    const { marca, modelo, anio, precioPorDia, imagenURL, descripcion } = car;

    return (
        <div className="car-card">
            <img src={imagenURL} alt={`${marca} ${modelo}`} className="car-card-image" />
            <div className="car-card-body">
                <h2 className="car-card-title">{`${marca} ${modelo}`}</h2>
                <p>Año: {anio}</p>
                <p className="car-card-price">${precioPorDia}<span>/día</span></p>

                {/* Botón para seleccionar */}
                <button
                    className="car-card-button"
                    onClick={() => onSelect(car)}
                >
                    Ver Detalles y Alquilar
                </button>
            </div>
        </div>
    );
}

export default CarCard;