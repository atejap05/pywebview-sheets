import React, { useState, useEffect } from "react";
import { X, Package, DollarSign, FileText } from "lucide-react";
import { useForm } from "react-hook-form";

function ProductModal({ product, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      description: "",
    },
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description);
    } else {
      reset();
    }
  }, [product, setValue, reset]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      // Converte preço para número
      const productData = {
        ...data,
        price: parseFloat(data.price),
      };
      await onSave(productData);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = value => {
    // Remove tudo que não é dígito ou ponto
    const numbers = value.replace(/[^\d.,]/g, "");

    // Substitui vírgula por ponto para conversão
    const normalized = numbers.replace(",", ".");

    // Se tem ponto, mantém apenas um
    const parts = normalized.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    return normalized;
  };

  const handlePriceChange = e => {
    const formatted = formatPrice(e.target.value);
    setValue("price", formatted);
  };

  const validatePrice = price => {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) && numPrice >= 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Editar Produto" : "Novo Produto"}
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
                <Package size={16} style={{ marginRight: "0.5rem" }} />
                Nome do Produto *
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Digite o nome do produto"
                {...register("name", {
                  required: "Nome do produto é obrigatório",
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
                <DollarSign size={16} style={{ marginRight: "0.5rem" }} />
                Preço *
              </label>
              <input
                type="text"
                className={`form-input ${errors.price ? "error" : ""}`}
                placeholder="0.00"
                {...register("price", {
                  required: "Preço é obrigatório",
                  validate: value =>
                    validatePrice(value) ||
                    "Preço deve ser um número válido maior ou igual a zero",
                })}
                onChange={handlePriceChange}
                disabled={loading}
              />
              {errors.price && (
                <div className="form-error">{errors.price.message}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={16} style={{ marginRight: "0.5rem" }} />
                Descrição *
              </label>
              <textarea
                className={`form-input ${errors.description ? "error" : ""}`}
                placeholder="Digite a descrição do produto"
                rows={4}
                {...register("description", {
                  required: "Descrição é obrigatória",
                  minLength: {
                    value: 5,
                    message: "Descrição deve ter pelo menos 5 caracteres",
                  },
                })}
                disabled={loading}
                style={{ resize: "vertical", minHeight: "100px" }}
              />
              {errors.description && (
                <div className="form-error">{errors.description.message}</div>
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

export default ProductModal;
