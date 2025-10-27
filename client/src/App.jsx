import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navBar.jsx";
import HomePage from "./pages/HomePage.jsx"; // Importa la pagina de inicio
import AboutPage from "./pages/AboutPage.jsx"; // Importa la pagina "Nosotros"
import LoginPage from "./pages/Login.jsx";//Import Login
import SignupPage from "./pages/SignupPage.jsx";  //Import Signup

function App() {
  return (
    <>
      <NavBar />
      <div className="app-container">
        <h1>Rentados</h1>
        <p>Tu plataforma de confianza para rentar vehículos</p>

        {/* Aqui se renderizara el componente de la página actual */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </>
  );
}
export default App;
