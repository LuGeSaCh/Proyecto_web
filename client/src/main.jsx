import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

//Sirve para renderizar la aplicacion en el html, es decir que practicamente lo que hace es llamar al div con id root en el html y renderiza la aplicacion de react ahi

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
