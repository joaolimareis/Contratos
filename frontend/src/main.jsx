import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/variables.css";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);