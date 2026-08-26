import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;