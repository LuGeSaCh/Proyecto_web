import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navBar.jsx";
import HomePage from "./pages/HomePage.jsx"; // Importa la pagina de inicio
import AboutPage from "./pages/AboutPage.jsx"; // Importa la pagina "Nosotros"
import HelpPage from "./pages/HelpPage.jsx";  //Import Signup
import LoginPage from "./pages/Login.jsx";//Import Login
import SignupPage from "./pages/SignupPage.jsx";  //Import Signup
import RentYourCarPage from "./pages/RentYourCarPage.jsx"; //Import RentYourCarPage
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CreateCarPage from "./pages/CreateCarPage.jsx";
//prueba

function App() {
  return (
    <>
      <NavBar />
      <div className="app-container">
        <h1>Rentados</h1>
        <p>Tu mejor decisión sobre ruedas!</p> {/*slogan*/}

        {/* Aqui se renderizara el componente de la página actual */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/ayuda" element={<HelpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/rent-your-car" element={<RentYourCarPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-car" element={<CreateCarPage />} />
        </Routes>
      </div>
    </>
  );
}
export default App;
