import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  DollarSign,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import { productService } from "../services/api";
import ProductModal from "./ProductModal";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error(error.message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = product => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async product => {
    if (
      !window.confirm(
        `Tem certeza que deseja remover o produto "${product.name}"?`
      )
    ) {
      return;
    }

    try {
      await productService.delete(product.row_index);
      toast.success("Produto removido com sucesso");
      loadProducts();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      toast.error(error.message || "Erro ao remover produto");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleModalSave = async productData => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.row_index, productData);
        toast.success("Produto atualizado com sucesso");
      } else {
        await productService.create(productData);
        toast.success("Produto criado com sucesso");
      }

      loadProducts();
      handleModalClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error(error.message || "Erro ao salvar produto");
    }
  };

  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = value => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Produtos</h1>
        <p className="page-subtitle">Gerencie os produtos do sistema</p>
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
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>
          <button onClick={handleCreateProduct} className="btn btn-primary">
            <Plus size={20} />
            Novo Produto
          </button>
        </div>

        <div className="section-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <span>Carregando produtos...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}
            >
              <Package
                size={48}
                style={{ marginBottom: "1rem", opacity: 0.5 }}
              />
              <h3 style={{ margin: "0 0 0.5rem 0" }}>
                {searchTerm
                  ? "Nenhum produto encontrado"
                  : "Nenhum produto cadastrado"}
              </h3>
              <p style={{ margin: "0" }}>
                {searchTerm
                  ? "Tente ajustar os termos de busca"
                  : 'Clique em "Novo Produto" para começar'}
              </p>
            </div>
          ) : (
            <div className="table-container" style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th style={{ width: "120px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
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
                              borderRadius: "0.5rem",
                              backgroundColor: "#10b981",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "600",
                              fontSize: "0.875rem",
                            }}
                          >
                            <Package size={20} />
                          </div>
                          <div>
                            <div
                              style={{ fontWeight: "500", color: "#111827" }}
                            >
                              {product.name}
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
                          <FileText size={16} style={{ color: "#6b7280" }} />
                          <span
                            style={{
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.description}
                          </span>
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
                          <DollarSign size={16} style={{ color: "#10b981" }} />
                          <span style={{ fontWeight: "600", color: "#10b981" }}>
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="btn btn-secondary btn-sm"
                            title="Editar produto"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="btn btn-danger btn-sm"
                            title="Remover produto"
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
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default ProductManagement;
