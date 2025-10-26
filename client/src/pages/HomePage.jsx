import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../components/CarCard.jsx";

function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/cars")
      .then((res) => {
        const payload = res.data?.cars ?? res.data;
        setCars(Array.isArray(payload) ? payload : payload ? [payload] : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setError("Error al cargar los carros.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando catalogo...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (cars.length === 0) return <p>No hay carros disponibles.</p>;

  return (
    <div className="catalog-grid">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}

export default HomePage;
