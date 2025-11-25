import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CarCard from "../components/CarCard.jsx";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Estado para el proceso de reserva
  const [selectedCar, setSelectedCar] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Estados para el formulario de pago
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de Crédito");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = () => {
    setLoading(true);
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
  };

  // Cálculo de días y precio
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const totalPrice = selectedCar ? (selectedCar.precioPorDia * days).toFixed(2) : 0;

  // --- LÓGICA PRINCIPAL DE RESERVA Y PAGO ---
  const handleReservationAndPayment = async () => {
    const token = localStorage.getItem("token");

    // 1. Validaciones previas
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
      setProcessing(true); // Activar spinner o texto de carga

      // --- PASO 1: CREAR LA RESERVA (Bloquea el carro) ---
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
      console.log("Reserva creada, ID:", alquilerId);

      // --- PASO 2: PROCESAR EL PAGO (Confirma la reserva) ---
      const paymentData = {
        alquilerId: alquilerId,
        monto: totalPrice,
        metodoPago: paymentMethod,
        datosTarjeta: {
          numero: cardNumber, // El backend validará esto (no debe terminar en 0000)
          expiracion: cardExpiry,
          cvv: cardCvv
        }
      };

      await axios.post(
        "http://localhost:3001/api/pagos", 
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // --- ÉXITO ---
      alert("¡Pago aprobado y reserva confirmada! Disfruta tu viaje.");
      setSelectedCar(null); // Cerrar resumen
      setCardNumber(""); // Limpiar formulario
      loadCars(); // Recargar carros (el que alquilaste ya no debería salir o salir inactivo)

    } catch (err) {
      console.error(err);
      // Si falla el backend nos manda un mensaje (ej: "Fondos insuficientes")
      const msg = err.response?.data?.message || "Ocurrió un error al procesar la reserva.";
      alert("Error: " + msg);
    } finally {
      setProcessing(false);
    }
  };

  // Filtros de búsqueda
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

      {/* --- SECCIÓN DE RESUMEN Y PAGO (Visible al seleccionar carro) --- */}
      {selectedCar && (
        <div className="booking-summary" style={{
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          marginBottom: '30px',
          animation: 'fadeIn 0.4s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>Finalizar Reserva</h2>
            <button 
              onClick={() => setSelectedCar(null)}
              style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}
            >✕</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            
            {/* Columna Izquierda: Detalles del Carro */}
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <img
                  src={selectedCar.imagenURL}
                  alt={selectedCar.modelo}
                  style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{selectedCar.marca} {selectedCar.modelo}</h3>
                  <p style={{ margin: 0, color: '#666' }}>{selectedCar.anio} - {selectedCar.departamento}</p>
                </div>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <p style={{ margin: '5px 0' }}>📅 <strong>Fechas:</strong> {pickupDate || '...'} al {returnDate || '...'}</p>
                <p style={{ margin: '5px 0' }}>⏳ <strong>Duración:</strong> {days} días</p>
                <p style={{ margin: '5px 0', fontSize: '1.2rem', color: '#007bff' }}>
                  💵 <strong>Total a pagar: ${totalPrice}</strong>
                </p>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Pago */}
            <div style={{ flex: '1 1 300px', borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
              <h3 style={{ marginTop: 0 }}>Método de Pago</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Tipo de Tarjeta</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  <option>Tarjeta de Crédito</option>
                  <option>Tarjeta de Débito</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Número de Tarjeta</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength="19"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <small style={{color: '#888', fontSize: '0.8rem'}}>* Simulación: No uses tarjetas reales.</small>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Expiración</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength="5"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>CVV</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength="3"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>

              <button 
                onClick={handleReservationAndPayment}
                disabled={processing}
                className="car-card-button" 
                style={{ 
                  width: '100%', 
                  marginTop: '20px', 
                  backgroundColor: processing ? '#ccc' : '#28a745',
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              >
                {processing ? "Procesando pago..." : `Pagar $${totalPrice}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Catálogo (Sin cambios mayores) */}
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
          /> a
          <span className="date-separator"></span>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="filter-input"
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