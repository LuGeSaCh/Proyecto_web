import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import CarCard from "../components/CarCard.jsx";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Estados existentes
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nuevo estado para carros cercanos
  const [nearbyCars, setNearbyCars] = useState([]);
  const [userLocation, setUserLocation] = useState(""); // Para mostrar el nombre del depto

  // Filtros existentes
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Estado para reserva y pago
  const [selectedCar, setSelectedCar] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de Crédito");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

// Si el usuario está autenticado, cargar carros cercanos, y lista de carros en general
  useEffect(() => {
    loadCars();
    if (isAuthenticated) {
      loadNearbyCars();
    }
  }, [isAuthenticated]); 

  // Función para cargar la lista de carros 
  const loadCars = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/api/carros") //Haciendo petición a la API
      .then((res) => {
        const payload = res.data?.cars ?? res.data; //Estamos diciendo que guardar,
        // porque a veces el backend manda la lista de carros asi: { cars: [...] } y a veces solo [...]
        setCars(Array.isArray(payload) ? payload : payload ? [payload] : []);
        //garantiza que setCars siempre reciba un array
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setError("Error al cargar los carros.");
        setLoading(false);
      });
  };


  const loadNearbyCars = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:3001/api/carros/cerca", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNearbyCars(res.data.carros);
      setUserLocation(res.data.ubicacionUsuario);
    } catch (err) {
      console.log("No se pudieron cargar carros cercanos o el usuario no tiene ubicación", err);
    }
  };

//Funcion para calcular los dias que el usuario quiere rentar el carro
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate); //convertir cadena de texto a objeto fecha
    const end = new Date(returnDate);
    const diffTime = end - start; 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); //ceil para redondear siempre hacia arriba
    return diffDays > 0 ? diffDays : 1; 
  };

  const days = calculateDays();
  const totalPrice = selectedCar ? (selectedCar.precioPorDia * days).toFixed(2) : 0;

  const handleReservationAndPayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para reservar.");
      navigate("/login");
      return;
    }
    if (!pickupDate || !returnDate) {
      alert("Por favor selecciona las fechas de recogida y devolución.");
      return;
    }
    if (!cardNumber || !cardExpiry || !cardCvv) {
      alert("Por favor completa los datos de la tarjeta.");
      return;
    }

    try {
      setProcessing(true);

      const rentalData = {
        vehiculoId: selectedCar.id,
        fechaInicio: pickupDate,
        fechaFin: returnDate,
        total: totalPrice
      };

      const rentalResponse = await axios.post(
        "http://localhost:3001/api/rentals",
        rentalData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { alquilerId } = rentalResponse.data;

      const paymentData = {
        alquilerId: alquilerId,
        monto: totalPrice,
        metodoPago: paymentMethod,
        datosTarjeta: {
          numero: cardNumber,
          expiracion: cardExpiry,
          cvv: cardCvv
        }
      };

      await axios.post(
        "http://localhost:3001/api/pagos",
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("¡Pago aprobado y reserva confirmada! Disfruta tu viaje.");
      setSelectedCar(null);
      setCardNumber("");
      loadCars();
      if (isAuthenticated) loadNearbyCars(); 

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Ocurrió un error al procesar la reserva.";
      alert("Error: " + msg);
    } finally {
      setProcessing(false);
    }
  };

  // Filtros del catalogo general
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

      {selectedCar && (
        <div className="booking-summary">
          <div className="booking-header">
            <h2 className="booking-title">Finalizar Reserva</h2>
            <button onClick={() => setSelectedCar(null)} className="close-button">✕</button>
          </div>

          <div className="booking-content">
            <div className="car-details-column">
              <div className="car-preview">
                <img
                  src={selectedCar.imagenURL}
                  alt={selectedCar.modelo}
                  className="car-preview-img"
                />
                <div className="car-preview-info">
                  <h3>{selectedCar.marca} {selectedCar.modelo}</h3>
                  <p>{selectedCar.anio} - {selectedCar.departamento}</p>
                </div>
              </div>

              <div className="pricing-box">
                <p>📅 <strong>Fechas:</strong> {pickupDate || '...'} al {returnDate || '...'}</p>
                <p>⏳ <strong>Duración:</strong> {days} días</p>
                <p className="total-price">
                  💵 <strong>Total a pagar: ${totalPrice}</strong>
                </p>
              </div>
            </div>
            <div className="payment-column">
              <h3 className="payment-title">Método de Pago</h3>
              
              <div className="input-wrapper">
                <label className="input-label">Número de Tarjeta</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength="19"
                  className="payment-input"
                />
              </div>

              <div className="row-inputs">
                <div className="flex-1">
                  <label className="input-label">Expiración</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={cardExpiry} 
                    onChange={(e) => setCardExpiry(e.target.value)} 
                    maxLength="5" 
                    className="payment-input" 
                  />
                </div>
                <div className="flex-1">
                  <label className="input-label">CVV</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    value={cardCvv} 
                    onChange={(e) => setCardCvv(e.target.value)} 
                    maxLength="3" 
                    className="payment-input" 
                  />
                </div>
              </div>

              <button 
                onClick={handleReservationAndPayment} 
                disabled={processing} 
                className="car-card-button pay-button"
              >
                {processing ? "Procesando pago..." : `Pagar $${totalPrice}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthenticated && nearbyCars.length > 0 && (
        <div className="nearby-section">
          <h2 className="section-title-special">
            📍 Cerca de ti en <span className="highlight-location">{userLocation}</span>
          </h2>
          <div className="catalog-grid">
            {nearbyCars.map((car) => (
              <CarCard key={car.id} car={car} onSelect={setSelectedCar} />
            ))}
          </div>
          <hr className="section-divider" />
        </div>
      )}

      <div className="filters-container">
        <h2 className="catalog-title">Catálogo General</h2>
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
            placeholder="Año"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group date-group">
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="filter-input" /> a
          <span className="date-separator"></span>
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="filter-input" />
        </div>
        <div className="filter-group">
          <select value={priceOrder} onChange={(e) => setPriceOrder(e.target.value)} className="filter-select">
            <option value="">Ordenar precio</option>
            <option value="asc">Menor a Mayor</option>
            <option value="desc">Mayor a Menor</option>
          </select>
        </div>
      </div>

      {processedCars.length === 0 ? (
        <p className="no-results">No se encontraron vehículos con esos criterios.</p>
      ) : (
        <div className="catalog-grid">
          {processedCars.map((car) => (
            <CarCard key={car.id} car={car} onSelect={setSelectedCar} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;