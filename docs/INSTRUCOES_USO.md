# 🚀 Instruções de Uso - PyWebView + React + Google Sheets

## 📋 Visão Geral

Este projeto demonstra como integrar **ReactJS** com **Python** usando **PyWebView**, conectando com **Google Sheets** para operações CRUD completas.

## 🎯 Funcionalidades Implementadas

### ✅ Backend Python

- **Flask** como servidor web
- **Google Sheets API** para persistência de dados
- **Validação** de dados com modelos Python
- **API REST** completa para CRUD

### ✅ Frontend React

- **Interface moderna** e responsiva
- **React Router** para navegação
- **Formulários** com validação
- **Notificações** com toast
- **Busca** e filtros em tempo real

### ✅ Integração PyWebView

- **Aplicação desktop** nativa
- **Servidor integrado** Flask + React
- **Configurações otimizadas** para performance

## 🛠️ Tecnologias Utilizadas

| Tecnologia        | Versão  | Propósito             |
| ----------------- | ------- | --------------------- |
| Python            | 3.8+    | Backend e PyWebView   |
| React             | 18.2.0  | Frontend              |
| Flask             | 3.0.0   | Servidor web          |
| PyWebView         | 4.4.1   | Interface desktop     |
| Google Sheets API | 2.108.0 | Persistência de dados |

## 📁 Estrutura do Projeto

```
pywebview-sheets/
├── backend/                 # Backend Python
│   ├── app.py              # Servidor Flask + API
│   ├── google_sheets.py    # Integração Google Sheets
│   └── models.py           # Modelos de dados
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Serviços API
│   │   └── App.js          # App principal
│   └── package.json
├── main.py                 # Arquivo principal
├── build_and_run.py        # Script de build e execução
└── README.md
```

## 🚀 Como Executar

### Método 1: Automático (Recomendado)

```bash
python build_and_run.py
```

### Método 2: Manual

```bash
# 1. Instalar dependências Python
pip install -r requirements.txt

# 2. Instalar dependências React
cd frontend
npm install

# 3. Build do React
npm run build
cd ..

# 4. Executar aplicação
python main.py
```

## ⚙️ Configuração do Google Sheets

### 1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **Google Sheets API**

### 2. Configurar Credenciais

1. Vá em "APIs e Serviços" > "Credenciais"
2. Crie credenciais OAuth 2.0
3. Baixe o arquivo JSON
4. Renomeie para `credentials.json`
5. Coloque na pasta raiz do projeto

### 3. Configurar Planilha

1. Crie uma planilha no Google Sheets
2. Renomeie para "script-rfb-teste"
3. Crie duas abas:
   - **User**: colunas name, cpf, email
   - **Product**: colunas name, price, description

### 4. Configurar Variáveis

```bash
cp env.example .env
# Edite o .env com suas configurações
```

## 📊 Como Usar a Aplicação

### 1. Dashboard

- **Visão geral** do sistema
- **Estatísticas** de usuários e produtos
- **Ações rápidas** para navegação

### 2. Gerenciamento de Usuários

- **Listar** todos os usuários
- **Criar** novo usuário
- **Editar** usuário existente
- **Remover** usuário
- **Buscar** por nome, email ou CPF

### 3. Gerenciamento de Produtos

- **Listar** todos os produtos
- **Criar** novo produto
- **Editar** produto existente
- **Remover** produto
- **Buscar** por nome ou descrição

### 4. Configurações

- **Status** da conexão com Google Sheets
- **Informações** do sistema
- **Instruções** de configuração

## 🔧 Desenvolvimento

### Modo Debug

```bash
python main.py
# Abre DevTools automaticamente
```

### Desenvolvimento Frontend

```bash
cd frontend
npm start
# Servidor de desenvolvimento na porta 3000
```

### Estrutura da API

```
GET    /api/users          # Lista usuários
POST   /api/users          # Cria usuário
PUT    /api/users/:id      # Atualiza usuário
DELETE /api/users/:id      # Remove usuário

GET    /api/products       # Lista produtos
POST   /api/products       # Cria produto
PUT    /api/products/:id   # Atualiza produto
DELETE /api/products/:id   # Remove produto

GET    /api/health         # Status da API
```

## 🐛 Solução de Problemas

### Erro: "Google Sheets não configurado"

- Verifique se `credentials.json` existe
- Confirme se o ID da planilha está correto
- Teste a conexão em Configurações

### Erro: "Build do React não encontrado"

```bash
cd frontend
npm run build
```

### Erro: "Dependências não encontradas"

```bash
pip install -r requirements.txt
cd frontend && npm install
```

### Erro: "Porta 5000 em uso"

- Feche outras aplicações na porta 5000
- Ou mude a porta no `main.py`

## 📈 Próximos Passos

### Melhorias Possíveis

1. **Autenticação** de usuários
2. **Relatórios** em PDF
3. **Backup** automático
4. **Sincronização** offline
5. **Temas** personalizáveis
6. **Logs** de auditoria

### Deploy

1. **PyInstaller** para executável
2. **Docker** para containerização
3. **GitHub Actions** para CI/CD

## 📚 Recursos Adicionais

- [Documentação PyWebView](https://pywebview.flowrl.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [React Documentation](https://reactjs.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é para fins educacionais e demonstração.

---

**Desenvolvido com ❤️ usando PyWebView + React + Google Sheets**
