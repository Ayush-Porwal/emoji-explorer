import React from "react";
import ReactDOM from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";

import App from "./App.jsx";

import "primereact/resources/primereact.min.css";
import "../node_modules/primeflex/primeflex.css";
import "primeicons/primeicons.css";

import "./index.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
