import React, { useState, useEffect } from "react";
import { X, User, Mail, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";

function UserModal({ user, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("cpf", user.cpf);
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      await onSave(data);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = value => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return value;
  };

  const handleCPFChange = e => {
    const formatted = formatCPF(e.target.value);
    setValue("cpf", formatted);
  };

  const validateCPF = cpf => {
    const numbers = cpf.replace(/\D/g, "");
    return numbers.length === 11;
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                <User size={16} style={{ marginRight: "0.5rem" }} />
                Nome Completo *
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Digite o nome completo"
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
                disabled={loading}
              />
              {errors.name && (
                <div className="form-error">{errors.name.message}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ marginRight: "0.5rem" }} />
                Email *
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Digite o email"
                {...register("email", {
                  required: "Email é obrigatório",
                  validate: value => validateEmail(value) || "Email inválido",
                })}
                disabled={loading}
              />
              {errors.email && (
                <div className="form-error">{errors.email.message}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <CreditCard size={16} style={{ marginRight: "0.5rem" }} />
                CPF *
              </label>
              <input
                type="text"
                className={`form-input ${errors.cpf ? "error" : ""}`}
                placeholder="000.000.000-00"
                {...register("cpf", {
                  required: "CPF é obrigatório",
                  validate: value =>
                    validateCPF(value) || "CPF deve ter 11 dígitos",
                })}
                onChange={handleCPFChange}
                disabled={loading}
                maxLength={14}
              />
              {errors.cpf && (
                <div className="form-error">{errors.cpf.message}</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div
                    className="spinner"
                    style={{ width: "1rem", height: "1rem" }}
                  ></div>
                  {isEditing ? "Atualizando..." : "Criando..."}
                </>
              ) : isEditing ? (
                "Atualizar"
              ) : (
                "Criar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
