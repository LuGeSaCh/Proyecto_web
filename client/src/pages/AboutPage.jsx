import React from "react";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      {/* Sección Superior: Introducción Inspiradora */}
      <section className="about-intro">
        <div className="about-text">
          <h2>Descubre El Salvador a tu ritmo</h2>
          <p>
            En <strong>Rentados</strong>, creemos que el viaje es tan importante como el destino. 
            Nacimos con una idea clara: revolucionar la forma en que te mueves por El Salvador. 
            Ya sea que necesites un auto compacto para moverte por la ciudad, una camioneta 
            para explorar nuestras playas o un vehículo robusto para la montaña, nosotros 
            hacemos que el proceso sea simple, transparente y seguro.
          </p>
          <p>
            Somos más que una plataforma de alquiler; somos tu copiloto de confianza. 
            Conectamos a dueños de vehículos con personas que buscan libertad de movimiento, 
            creando una comunidad basada en la honestidad y el servicio de calidad.
          </p>
        </div>
        <div className="about-image">
          {/* Puedes cambiar esta URL por una foto local de El Salvador si tienes una */}
          <img
            src="https://i.postimg.cc/QtsSTVW0/129479806-3506559186066632-5706432838281906400-n.jpg"
            alt="Vehículos modernos en carretera"
          />
        </div>
      </section>

      {/* Sección Central: Tarjetas de Misión y Visión */}
      <section className="about-cards">
        <div className="card-container">
          <div className="card">
            <h2>Nuestra Misión</h2>
            <p>
              Centralizar y simplificar la renta de vehículos en El Salvador. 
              Construimos un puente seguro y eficiente entre arrendadores y clientes, 
              ofreciendo una plataforma intuitiva con publicaciones detalladas y 
              filtros avanzados. Nos comprometemos a garantizar una experiencia 
              transparente, donde cada usuario encuentre el vehículo perfecto con 
              la confianza de un servicio de calidad.
            </p>
          </div>
          <div className="card">
            <h2>Nuestra Visión</h2>
            <p>
              Aspiramos a ser la plataforma referente en la gestión de alquiler de 
              vehículos en El Salvador. Visualizamos un futuro donde la movilidad 
              sea sinónimo de eficiencia, confianza y personalización. Lograremos 
              esto mediante la continua innovación en funcionalidades como gestión 
              de calendarios y sistemas de reseñas robustos, manteniendo la máxima 
              seguridad en cada transacción.
            </p>
          </div>
        </div>
      </section>

      {/* Sección Inferior: Por qué elegirnos (Puntos clave) */}
      <section className="about-why">
        <h2>¿Por qué elegir Rentados?</h2>
        <div className="why-grid">
          <div className="why-item">
            <h3>🔒 Seguridad Garantizada</h3>
            <p>
              Verificamos cada vehículo y arrendador para asegurar que tu única 
              preocupación sea disfrutar el camino.
            </p>
          </div>
          <div className="why-item">
            <h3>🚀 Rápido y Digital</h3>
            <p>
              Olvídate del papeleo interminable. Nuestra plataforma te permite 
              buscar, filtrar y reservar en cuestión de minutos.
            </p>
          </div>
          <div className="why-item">
            <h3>🇸🇻 Pasión Local</h3>
            <p>
              Entendemos las necesidades del conductor salvadoreño y del turista 
              que nos visita. Ofrecemos soporte real y cercano.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;