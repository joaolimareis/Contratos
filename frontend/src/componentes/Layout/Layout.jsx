import { Outlet } from "react-router-dom";
import Navbar from "./../NavBar";
import "./Layout.css"; 
export default function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}