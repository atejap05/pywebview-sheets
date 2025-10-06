# PyWebView + React + Google Sheets

Este projeto demonstra como integrar ReactJS com Python usando PyWebView, conectando com Google Sheets para operações CRUD.

## Estrutura do Projeto

```
pywebview-sheets/
├── backend/                     # Backend Python com Flask
│   ├── __init__.py             # Inicialização do pacote
│   ├── app.py                  # Aplicação Flask principal
│   ├── google_sheets.py        # Integração com Google Sheets
│   └── models.py               # Modelos de dados
├── frontend/                    # Frontend React
│   ├── public/                 # Arquivos públicos
│   ├── src/                    # Código-fonte React
│   │   ├── components/         # Componentes React
│   │   ├── services/           # Serviços (API)
│   │   ├── App.js             # Componente principal
│   │   ├── App.css            # Estilos principais
│   │   └── index.js           # Ponto de entrada
│   ├── build/                  # Build de produção (gerado)
│   └── package.json            # Dependências React
├── venv/                       # Ambiente virtual Python (auto-gerado)
├── main.py                     # Arquivo principal PyWebView
├── build_and_run.py            # Script de build e execução
├── activate_env.py             # Utilitário para ambiente virtual
├── webview_config.py           # Configurações do PyWebView
├── requirements.txt            # Dependências Python
├── env.example                 # Exemplo de variáveis de ambiente
├── .env                        # Variáveis de ambiente (não versionado)
├── .gitignore                  # Arquivos ignorados pelo Git
├── credentials.json            # Credenciais Google (não versionado)
├── token.json                  # Token OAuth (não versionado)
├── docs/                       # 📚 Documentação completa
│   ├── README.md              # Índice da documentação
│   ├── GOOGLE_SHEETS_SETUP.md # Guia de configuração OAuth
│   ├── INSTRUCOES_USO.md      # Manual de uso da aplicação
│   ├── TUTORIAL_PYWEBVIEW.md  # Tutorial técnico completo
│   ├── TODO.md                # Tarefas e guia de distribuição
│   └── PROJETO_COMPLETO.md    # Visão geral do projeto
└── README.md                   # Este arquivo
```

## Configuração

### 1. Configurar Ambiente Virtual

O projeto usa um ambiente virtual Python isolado para manter as dependências organizadas.

```bash
# O script build_and_run.py cria automaticamente o ambiente virtual
python build_and_run.py

# Ou manualmente:
python -m venv venv
# Ativar: venv\Scripts\activate (Windows) ou source venv/bin/activate (macOS/Linux)
```

### 2. Configurar Google Sheets API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google Sheets API
4. Crie credenciais (OAuth 2.0 Client ID)
5. Baixe o arquivo JSON e renomeie para `credentials.json`
6. Copie o ID da planilha e cole em `env.example`

### 3. Instalar Dependências React

```bash
cd frontend
npm install
```

### 4. Configurar Variáveis de Ambiente

```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

## Execução

### Método Automático (Recomendado)

```bash
# Cria ambiente virtual, instala dependências, faz build e executa
python build_and_run.py
```

### Método Manual

#### 1. Criar Ambiente Virtual

```bash
# Cria ambiente virtual Python
python -m venv venv

# Ativa ambiente virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

#### 2. Instalar Dependências

```bash
# Python (no ambiente virtual)
pip install -r requirements.txt

# React
cd frontend
npm install
```

#### 3. Build do React

```bash
cd frontend
npm run build
```

#### 4. Executar Aplicação

```bash
# Na pasta raiz (com ambiente virtual ativo)
python main.py
```

### Scripts Auxiliares

#### Ativador do Ambiente Virtual

```bash
# Mostra ajuda
python activate_env.py help

# Executa aplicação
python activate_env.py run

# Instala dependências
python activate_env.py install

# Abre shell Python
python activate_env.py shell

# Executa comandos pip
python activate_env.py pip list
python activate_env.py pip install package_name

# Mostra informações do ambiente
python activate_env.py info
```

### Desenvolvimento (Opcional)

```bash
# Terminal 1 - Backend + Frontend integrado
python main.py

# Terminal 2 - Frontend para desenvolvimento (opcional)
cd frontend
npm start
```

## Funcionalidades

- ✅ CRUD de Usuários (name, cpf, email)
- ✅ CRUD de Produtos (name, price, description)
- ✅ Interface React moderna e responsiva
- ✅ Integração com Google Sheets
- ✅ Aplicação desktop com PyWebView

## 📚 Documentação

Este projeto possui documentação completa e detalhada no diretório `/docs/`:

### 📖 Guias Disponíveis

1. **[Tutorial PyWebView](./docs/TUTORIAL_PYWEBVIEW.md)** ⭐
   - Tutorial técnico completo sobre PyWebView
   - Integração com Flask e Google Sheets
   - Exemplos práticos e código
   - Boas práticas e troubleshooting

2. **[TODO e Distribuição](./docs/TODO.md)** ⭐
   - Tarefas e melhorias planejadas
   - **Guia completo de como distribuir a aplicação**
   - Como empacotar com PyInstaller
   - Como criar instaladores para usuários

3. **[Configuração Google Sheets](./docs/GOOGLE_SHEETS_SETUP.md)**
   - Setup do Google Cloud Console
   - Criação de credenciais OAuth
   - Configuração passo a passo

4. **[Instruções de Uso](./docs/INSTRUCOES_USO.md)**
   - Manual completo da aplicação
   - Funcionalidades detalhadas
   - Solução de problemas

5. **[Visão Geral do Projeto](./docs/PROJETO_COMPLETO.md)**
   - Resumo técnico completo
   - Tecnologias utilizadas
   - Funcionalidades implementadas

### 🎯 Acesso Rápido

```bash
# Veja o índice completo da documentação
cat docs/README.md

# Ou navegue diretamente:
# - Aprender PyWebView: docs/TUTORIAL_PYWEBVIEW.md
# - Distribuir aplicação: docs/TODO.md
# - Configurar Google: docs/GOOGLE_SHEETS_SETUP.md
```

## 🚀 Próximos Passos

1. **Execute o projeto**: `python build_and_run.py`
2. **Leia a documentação**: Comece por [`docs/README.md`](./docs/README.md)
3. **Aprenda PyWebView**: Estude [`docs/TUTORIAL_PYWEBVIEW.md`](./docs/TUTORIAL_PYWEBVIEW.md)
4. **Distribua sua app**: Siga [`docs/TODO.md`](./docs/TODO.md)

## 🤝 Contribuindo

Veja as tarefas pendentes e sugestões de melhorias em [`docs/TODO.md`](./docs/TODO.md)
