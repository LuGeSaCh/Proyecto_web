import React from 'react';
import './RentYourCarPage.css'; // Crearemos este archivo de estilos
import rentyourcarimage from '../images/rent-your-car.png'; // Asegúrate de tener una imagen en esta ruta

function RentYourCarPage() {
    return (
    <div className="rent-car-container">
    <div className="rent-car-content">
        <h1>Gana dinero con tu vehículo</h1>
        <p>
        Convierte tu carro en una fuente de ingresos extra de forma segura y sencilla. En Rentados, estamos buscando socios como tú para ampliar nuestra flota.
        </p>
        <div className="contact-info">
          <h3>¿Te interesa? Contáctanos</h3>
          <p>
            Envíanos un correo con los detalles de tu vehículo (marca, modelo, año) y nos pondremos en contacto contigo para explicarte los beneficios y los siguientes pasos.
          </p>
          <a href="mailto:socios@rentados.com" className="contact-email-link">
            rentados@gmail.com
          </a>
        </div>
      </div>
      <div className="rent-car-image-container">
        <img src={rentyourcarimage} alt="Una persona mostrando cómo rentar su carro"/>
      </div>
    </div>
  );
}

export default RentYourCarPage;