import React, { useState, useEffect } from "react";
import { Users, Package, TrendingUp, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    loading: true,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Carrega dados em paralelo
      const [usersResponse, productsResponse] = await Promise.all([
        api.get("/users"),
        api.get("/products"),
      ]);

      const users = usersResponse.data.data || [];
      const products = productsResponse.data.data || [];

      setStats({
        users: users.length,
        products: products.length,
        loading: false,
      });

      // Usuários mais recentes (últimos 5)
      setRecentUsers(users.slice(-5).reverse());

      // Produtos mais recentes (últimos 5)
      setRecentProducts(products.slice(-5).reverse());
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const formatCurrency = value => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral do sistema de gerenciamento</p>
      </div>

      {/* Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Total de Usuários</h3>
            <div className="stat-icon users">
              <Users size={20} />
            </div>
          </div>
          <p className="stat-value">{stats.loading ? "..." : stats.users}</p>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            <span>Ativo</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Total de Produtos</h3>
            <div className="stat-icon products">
              <Package size={20} />
            </div>
          </div>
          <p className="stat-value">{stats.loading ? "..." : stats.products}</p>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            <span>Ativo</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">Sistema</h3>
            <div className="stat-icon total">
              <Activity size={20} />
            </div>
          </div>
          <p className="stat-value">Online</p>
          <div className="stat-change positive">
            <Activity size={14} />
            <span>Funcionando</span>
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        {/* Usuários Recentes */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Usuários Recentes</h2>
            <Link to="/users" className="btn btn-primary btn-sm">
              Ver Todos
            </Link>
          </div>
          <div className="section-content">
            {recentUsers.length === 0 ? (
              <p
                style={{
                  color: "#6b7280",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                Nenhum usuário encontrado
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {recentUsers.map((user, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <div>
                        <h4
                          style={{ margin: "0 0 0.25rem 0", color: "#111827" }}
                        >
                          {user.name}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 0.25rem 0",
                            color: "#6b7280",
                            fontSize: "0.875rem",
                          }}
                        >
                          {user.email}
                        </p>
                        <p
                          style={{
                            margin: "0",
                            color: "#6b7280",
                            fontSize: "0.75rem",
                          }}
                        >
                          CPF: {user.cpf}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Produtos Recentes */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Produtos Recentes</h2>
            <Link to="/products" className="btn btn-primary btn-sm">
              Ver Todos
            </Link>
          </div>
          <div className="section-content">
            {recentProducts.length === 0 ? (
              <p
                style={{
                  color: "#6b7280",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                Nenhum produto encontrado
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {recentProducts.map((product, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <div>
                        <h4
                          style={{ margin: "0 0 0.25rem 0", color: "#111827" }}
                        >
                          {product.name}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 0.25rem 0",
                            color: "#6b7280",
                            fontSize: "0.875rem",
                          }}
                        >
                          {product.description}
                        </p>
                        <p
                          style={{
                            margin: "0",
                            color: "#10b981",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                          }}
                        >
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Ações Rápidas</h2>
        </div>
        <div className="section-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <Link
              to="/users"
              className="btn btn-primary"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <Users size={20} />
              Gerenciar Usuários
            </Link>
            <Link
              to="/products"
              className="btn btn-primary"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <Package size={20} />
              Gerenciar Produtos
            </Link>
            <Link
              to="/settings"
              className="btn btn-secondary"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <Activity size={20} />
              Configurações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
