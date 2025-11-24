import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../components/CarCard.jsx";
import "./HomePage.css";

function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros existentes
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // 1. Estado para el carro seleccionado
  const [selectedCar, setSelectedCar] = useState(null);

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

  // Funcion para calcular precio
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1; // Si no hay fechas, cobramos min 1 dia
    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();

  const processedCars = cars
    .filter((car) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        car.marca.toLowerCase().includes(term) ||
        car.modelo.toLowerCase().includes(term);
      const matchesYear = yearFilter
        ? car.anio.toString().includes(yearFilter)
        : true;
      return matchesSearch && matchesYear;
    })
    .sort((a, b) => {
      if (priceOrder === "asc") return a.precioPorDia - b.precioPorDia;
      if (priceOrder === "desc") return b.precioPorDia - a.precioPorDia;
      return 0;
    });

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="home-page-container">

      {/*Parte de descripcion (Visible solo al seleccionar un carro) */}
      {selectedCar && (
        <div className="booking-summary" style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #90caf9',
          marginBottom: '20px',
          animation: 'fadeIn 0.5s'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>

            {/*Imagen del carro*/}
            <div style={{ flex: '0 0 150px' }}>
              <img
                src={selectedCar.imagenURL}
                alt={`${selectedCar.marca} ${selectedCar.modelo}`}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff'
                }}
              />
            </div>

            {/*Info del carro*/}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2 style={{ marginTop: 0, color: '#0d47a1', fontSize: '1.5rem' }}>Resumen de tu elección</h2>
                  <h3 style={{ margin: '5px 0' }}>{selectedCar.marca} {selectedCar.modelo} ({selectedCar.anio})</h3>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#555' }}>{selectedCar.descripcion}</p>
                </div>

                {/* Btn para cerrar el resumen */}
                <button
                  onClick={() => setSelectedCar(null)}
                  style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem' }}
                  title="Cerrar resumen"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: '#bbdefb', margin: '15px 0' }} />

          {/*Calculo del precio total */}
          <div className="price-calculation">
            <p>
              Precio por día: <strong>${selectedCar.precioPorDia}</strong> <br />
              Días seleccionados: <strong>{days}</strong> ({pickupDate || 'Hoy'} a {returnDate || 'Mañana'})
            </p>
            <h2 style={{ color: '#2e7d32' }}>
              Total a Pagar: ${(selectedCar.precioPorDia * days).toFixed(2)}
            </h2>

            <button className="car-card-button" style={{ width: '100%', marginTop: '10px', fontSize: '1.2rem' }}>
              Confirmar Reserva
            </button>
          </div>
        </div>
      )}

      {/*Filtros*/}
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
            // Importante: Pasamos la fun setSelectedCar
            <CarCard key={car.id} car={car} onSelect={setSelectedCar} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;