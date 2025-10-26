import React from "react";

function CarCard({ car }) {
    const { make, model, year, pricePerDay, imageURL} = car;

    return (
        <div className="car-card">
            <img src={imageURL} alt={`${make} ${model}`} className="car-card-image" />
            <h2>{`${make} ${model}`}</h2>
            <p>Año: {year}</p>
            <p>Precio por día: ${pricePerDay}</p>
        </div>
    );
}

export default CarCard;
