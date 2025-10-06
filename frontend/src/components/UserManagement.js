import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Mail,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import { userService } from "../services/api";
import UserModal from "./UserModal";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error(error.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = user => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async user => {
    if (
      !window.confirm(
        `Tem certeza que deseja remover o usuário "${user.name}"?`
      )
    ) {
      return;
    }

    try {
      await userService.delete(user.row_index);
      toast.success("Usuário removido com sucesso");
      loadUsers();
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      toast.error(error.message || "Erro ao remover usuário");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleModalSave = async userData => {
    try {
      if (editingUser) {
        await userService.update(editingUser.row_index, userData);
        toast.success("Usuário atualizado com sucesso");
      } else {
        await userService.create(userData);
        toast.success("Usuário criado com sucesso");
      }

      loadUsers();
      handleModalClose();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error(error.message || "Erro ao salvar usuário");
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm)
  );

  const formatCPF = cpf => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Usuários</h1>
        <p className="page-subtitle">Gerencie os usuários do sistema</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flex: 1,
            }}
          >
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search
                size={20}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                }}
              />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>
          <button onClick={handleCreateUser} className="btn btn-primary">
            <Plus size={20} />
            Novo Usuário
          </button>
        </div>

        <div className="section-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <span>Carregando usuários...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}
            >
              <User size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
              <h3 style={{ margin: "0 0 0.5rem 0" }}>
                {searchTerm
                  ? "Nenhum usuário encontrado"
                  : "Nenhum usuário cadastrado"}
              </h3>
              <p style={{ margin: "0" }}>
                {searchTerm
                  ? "Tente ajustar os termos de busca"
                  : 'Clique em "Novo Usuário" para começar'}
              </p>
            </div>
          ) : (
            <div className="table-container" style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th style={{ width: "120px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: "#3b82f6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "600",
                              fontSize: "0.875rem",
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div
                              style={{ fontWeight: "500", color: "#111827" }}
                            >
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Mail size={16} style={{ color: "#6b7280" }} />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <CreditCard size={16} style={{ color: "#6b7280" }} />
                          <span>{formatCPF(user.cpf)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-secondary btn-sm"
                            title="Editar usuário"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="btn btn-danger btn-sm"
                            title="Remover usuário"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default UserManagement;
