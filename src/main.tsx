import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

import { AuthProvider } from "./context/AuthContext";
import { HealthProvider } from "./context/HealthContext";
import { DarkModeProvider } from "./context/DarkModeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <AuthProvider>
        <HealthProvider>
          <App />
        </HealthProvider>
      </AuthProvider>
    </DarkModeProvider>
  </React.StrictMode>
);