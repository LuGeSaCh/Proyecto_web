import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../components/CarCard.jsx";
import "./HomePage.css";

function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState(""); 
  const [priceOrder, setPriceOrder] = useState(""); 
  const [pickupDate, setPickupDate] = useState(""); 
  const [returnDate, setReturnDate] = useState(""); 

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/carros")
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

  const processedCars = cars
    .filter((car) => {
      // Filtro de modelo/marca
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        car.marca.toLowerCase().includes(term) ||
        car.modelo.toLowerCase().includes(term);

      //Filtro de año
      const matchesYear = yearFilter
        ? car.year.toString() === yearFilter
        : true;

      return matchesSearch && matchesYear;
    })
    .sort((a, b) => {
      //Ordenar por precio
      if (priceOrder === "asc") {
        return a.pricePerDay - b.pricePerDay; 
      } else if (priceOrder === "desc") {
        return b.pricePerDay - a.pricePerDay; 
      }
      return 0; 
    });

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="home-page-container">
      <div className="filters-container">
        <h2 className="catalog-title"> Selecciona tu alquiler</h2>
        <div className="filter-group search-group">
          <input
            type="text"
            placeholder="Buscar marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <input
            type="number"
            placeholder="Año (ej. 2020)"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group date-group">
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="filter-input"
            aria-label="Fecha de recogida"
          /> a
          <span className="date-separator"></span>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="filter-input"
            aria-label="Fecha de devolución"
          />
        </div>

        <div className="filter-group">
          <select
            value={priceOrder}
            onChange={(e) => setPriceOrder(e.target.value)}
            className="filter-select"
          >
            <option value="">Ordenar precio</option>
            <option value="asc">Menor a Mayor</option>
            <option value="desc">Mayor a Menor</option>
          </select>
        </div>
      </div>

      {processedCars.length === 0 ? (
        <p className="no-results">
          No se encontraron vehículos con esos criterios.
        </p>
      ) : (
        <div className="catalog-grid">
          {processedCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;