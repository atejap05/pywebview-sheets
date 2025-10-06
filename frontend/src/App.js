import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Users, Package, Home, Settings } from "lucide-react";
import UserManagement from "./components/UserManagement";
import ProductManagement from "./components/ProductManagement";
import Dashboard from "./components/Dashboard";
import SettingsPage from "./components/SettingsPage";
import "./App.css";

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/users", label: "Usuários", icon: Users },
    { path: "/products", label: "Produtos", icon: Package },
    { path: "/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Sistema de Gerenciamento</h1>
        <p>PyWebView + React + Google Sheets</p>
      </div>
      <ul className="navbar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    // Verifica status da API
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          const data = await response.json();
          setApiStatus(data.sheets_connected ? "connected" : "disconnected");
        } else {
          setApiStatus("error");
        }
      } catch (error) {
        setApiStatus("error");
        console.error("Erro ao verificar API:", error);
      }
    };

    checkApiStatus();

    // Verifica status da API a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);

    // Monitora status de conexão
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getStatusMessage = () => {
    if (!isOnline) {
      return { type: "error", message: "Sem conexão com a internet" };
    }

    switch (apiStatus) {
      case "connected":
        return { type: "success", message: "Conectado ao Google Sheets" };
      case "disconnected":
        return {
          type: "warning",
          message: "API conectada, mas Google Sheets não configurado",
        };
      case "error":
        return { type: "error", message: "Erro de conexão com a API" };
      default:
        return { type: "info", message: "Verificando conexão..." };
    }
  };

  const status = getStatusMessage();

  return (
    <Router>
      <div className="app">
        <Navigation />

        <main className="main-content">
          <div className="status-bar">
            <div className={`status-indicator ${status.type}`}>
              <div className="status-dot"></div>
              <span>{status.message}</span>
            </div>
          </div>

          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
