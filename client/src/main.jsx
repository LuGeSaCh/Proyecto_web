import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; //Conecta  a react con el navegador
import { BrowserRouter } from "react-router-dom"; // habilita la navegacion sin tener que recargar la pagina
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Envuelve App que es el componente principal con BrowserRouter
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App /> 
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
