import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  Key,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { systemService } from "../services/api";

function SettingsPage() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [sheetsStatus, setSheetsStatus] = useState("checking");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      setLoading(true);
      const response = await systemService.health();
      const data = response.data;

      setApiStatus("connected");
      setSheetsStatus(data.sheets_connected ? "connected" : "disconnected");
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setApiStatus("error");
      setSheetsStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case "connected":
        return <CheckCircle size={20} style={{ color: "#10b981" }} />;
      case "disconnected":
        return <AlertCircle size={20} style={{ color: "#f59e0b" }} />;
      case "error":
        return <XCircle size={20} style={{ color: "#ef4444" }} />;
      default:
        return <AlertCircle size={20} style={{ color: "#6b7280" }} />;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "disconnected":
        return "Desconectado";
      case "error":
        return "Erro";
      default:
        return "Verificando...";
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case "connected":
        return "#10b981";
      case "disconnected":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">Configurações e status do sistema</p>
      </div>

      {/* Status do Sistema */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Status do Sistema</h2>
          <button
            onClick={checkSystemStatus}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="spinner"
                  style={{ width: "1rem", height: "1rem" }}
                ></div>
                Verificando...
              </>
            ) : (
              "Atualizar"
            )}
          </button>
        </div>
        <div className="section-content">
          <div style={{ display: "grid", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Database size={20} style={{ color: "#3b82f6" }} />
                <div>
                  <div style={{ fontWeight: "500", color: "#111827" }}>
                    API Backend
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Servidor Flask
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {getStatusIcon(apiStatus)}
                <span
                  style={{
                    color: getStatusColor(apiStatus),
                    fontWeight: "500",
                  }}
                >
                  {getStatusText(apiStatus)}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Key size={20} style={{ color: "#10b981" }} />
                <div>
                  <div style={{ fontWeight: "500", color: "#111827" }}>
                    Google Sheets
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Integração com planilhas
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {getStatusIcon(sheetsStatus)}
                <span
                  style={{
                    color: getStatusColor(sheetsStatus),
                    fontWeight: "500",
                  }}
                >
                  {getStatusText(sheetsStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Informações do Sistema</h2>
        </div>
        <div className="section-content">
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 0.75rem 0",
                }}
              >
                Tecnologias Utilizadas
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Frontend
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    React 18 + React Router
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Backend
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Python + Flask
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Desktop
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    PyWebView
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Dados
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Google Sheets API
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 0.75rem 0",
                }}
              >
                Funcionalidades
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f0f9ff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.5rem",
                    }}
                  >
                    ✅ CRUD Completo
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Criar, ler, atualizar e deletar usuários e produtos
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f0fdf4",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.5rem",
                    }}
                  >
                    ✅ Interface Moderna
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Design responsivo e intuitivo com React
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#fefce8",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.5rem",
                    }}
                  >
                    ✅ Integração em Tempo Real
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Sincronização automática com Google Sheets
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    backgroundColor: "#fdf2f8",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      marginBottom: "0.5rem",
                    }}
                  >
                    ✅ Aplicação Desktop
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Interface nativa usando PyWebView
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções de Configuração */}
      {sheetsStatus === "disconnected" && (
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Configuração do Google Sheets</h2>
          </div>
          <div className="section-content">
            <div className="alert alert-warning">
              <Info size={20} style={{ marginRight: "0.5rem" }} />
              <div>
                <strong>Google Sheets não configurado</strong>
                <p style={{ margin: "0.5rem 0 0 0" }}>
                  Para usar todas as funcionalidades, configure a integração com
                  Google Sheets:
                </p>
                <ol style={{ margin: "0.5rem 0 0 1rem" }}>
                  <li>Acesse o Google Cloud Console</li>
                  <li>Crie um projeto e ative a Google Sheets API</li>
                  <li>Baixe o arquivo de credenciais JSON</li>
                  <li>Renomeie para 'credentials.json' na pasta do projeto</li>
                  <li>Configure o ID da planilha no arquivo .env</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
