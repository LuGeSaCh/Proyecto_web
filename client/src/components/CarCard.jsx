import React from "react";


function CarCard({ car }) {
    const { marca, modelo, anio, precioPorDia, imagenURL, descripcion} = car;

    return (
        <div className="car-card">
            <img src={imagenURL} alt={`${marca} ${modelo}`} className="car-card-image" />
            <h2>{`${marca} ${modelo}`}</h2>
            <p>Año: {anio}</p>
            <p>Precio por día: ${precioPorDia}</p>
            <p>Descripcion: {descripcion}</p> 
        </div>
    );
}

export default CarCard;
