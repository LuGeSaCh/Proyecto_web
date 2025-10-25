import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import CarCard from "./components/carCard.jsx";

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    axios
      .get("http://localhost:3000/api/cars")
      .then((res) => {
        if (!mounted) return;
        const payload = res.data?.cars ?? res.data;
        setCars(Array.isArray(payload) ? payload : payload ? [payload] : []);
        setLoading(false);
      })
      .catch((err) => {
        if (mounted) {
          console.error("Error fetching cars:", err);
          setError("Failed to load cars.");
          setLoading(false);
          setCars([]);
        } // no romper si falla la API
      });
    return () => {
      mounted = false;
    };
  }, []);

  //Renderizado condicional
  const renderContent = () => {
    if (loading) {
      return <p>Cargando catálogo...</p>;
    }

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    if (cars.length === 0) {
      return <p>No hay carros disponibles en este momento.</p>;
    }

    return (
      <div className="catalog-grid">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1>Rentados</h1>
      <p>Tu plataforma de confianza para rentar vehículos</p>
      {renderContent()}
    </div>
  );
}

export default App;
