import axios from "axios";

// Configuração base da API
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  config => {
    // Adiciona timestamp para evitar cache
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Tratamento de erros de rede
    if (!error.response) {
      console.error("Erro de rede:", error.message);
      throw new Error("Erro de conexão. Verifique sua internet.");
    }

    // Tratamento de erros HTTP
    const status = error.response.status;
    const message =
      error.response.data?.error ||
      error.response.data?.message ||
      "Erro desconhecido";

    switch (status) {
      case 400:
        throw new Error(`Dados inválidos: ${message}`);
      case 401:
        throw new Error("Não autorizado. Faça login novamente.");
      case 403:
        throw new Error("Acesso negado.");
      case 404:
        throw new Error("Recurso não encontrado.");
      case 500:
        throw new Error(`Erro interno do servidor: ${message}`);
      default:
        throw new Error(`Erro ${status}: ${message}`);
    }
  }
);

// Serviços específicos
export const userService = {
  // Lista todos os usuários
  getAll: () => api.get("/users"),

  // Obtém usuário por ID
  getById: id => api.get(`/users/${id}`),

  // Cria novo usuário
  create: userData => api.post("/users", userData),

  // Atualiza usuário
  update: (id, userData) => api.put(`/users/${id}`, userData),

  // Remove usuário
  delete: id => api.delete(`/users/${id}`),
};

export const productService = {
  // Lista todos os produtos
  getAll: () => api.get("/products"),

  // Obtém produto por ID
  getById: id => api.get(`/products/${id}`),

  // Cria novo produto
  create: productData => api.post("/products", productData),

  // Atualiza produto
  update: (id, productData) => api.put(`/products/${id}`, productData),

  // Remove produto
  delete: id => api.delete(`/products/${id}`),
};

export const systemService = {
  // Verifica saúde da API
  health: () => api.get("/health"),
};

export default api;
