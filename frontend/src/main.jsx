import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import "./index.css";

// O <BrowserRouter> já deve estar dentro do seu App.jsx (é ele que
// faz o Login funcionar com useNavigate). Por isso ele NÃO entra
// aqui — só pode existir um <Router> em toda a árvore do app.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);