import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
   
    navigate("/");
  }

  return (
    <div className="dashboard-page min-vh-100">
      {/* Navbar simples */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold mb-0">Meu Sistema</span>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center p-5">
                <div className="mb-3">
                  <span className="display-6">✅</span>
                </div>
                <h2 className="fw-bold mb-2">Dashboard</h2>
                <p className="text-muted mb-0">
                  Você está autenticado com sucesso.
                </p>
                <button
  className="btn btn-outline-primary btn-sm"
  onClick={() => navigate("/usuarios")}
>
  Usuários
</button>
               <button
  className="btn btn-outline-primary btn-sm"
  onClick={() => navigate("/locador")}
>
  Locador
</button>
               <button
  className="btn btn-outline-primary btn-sm"
  onClick={() => navigate("/locatarios")}
>
  Locatários
</button>
          
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;