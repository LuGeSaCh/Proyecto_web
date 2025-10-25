import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import CarCard from "./components/carCard.jsx";
import Navbar from "./components/navBar.jsx";

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
          setError("Error al cargar los carros.");
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
      return <p>Cargando catálogo...</p>; // mientras carga los datos
    }

    if (error) {
      return <p className="error-message">{error}</p>; // por ejemplo si la API falla
    }

    if (cars.length === 0) {
      return <p>No hay carros disponibles en este momento.</p>; // si no hay carros
    }

    return (
      <div className="catalog-grid">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} /> //recorremos el array de carros y renderizamos una tarjeta por cada uno
        ))}
      </div>
    );
  };

  return (
    <>
    <Navbar/>
    <div className="app-container">
      <h1>Rentados</h1>
      <p>Tu plataforma de confianza para rentar vehículos</p>
      {renderContent()}
    </div>
    </>
  );
}

export default App;
