# Configuração do Google Sheets API

Este guia te ajudará a configurar a integração com Google Sheets para o projeto.

## Passo 1: Criar Projeto no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Clique em "Selecionar projeto" no topo da página
4. Clique em "Novo Projeto"
5. Digite um nome para o projeto (ex: "pywebview-sheets")
6. Clique em "Criar"

## Passo 2: Ativar Google Sheets API

1. No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
2. Procure por "Google Sheets API"
3. Clique no resultado e depois em "Ativar"
4. Aguarde alguns segundos para a ativação

## Passo 3: Criar Credenciais

1. Vá em "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "ID do cliente OAuth"
3. Se for a primeira vez, configure a tela de consentimento:
   - Escolha "Externo"
   - Preencha o nome do aplicativo
   - Adicione seu email como usuário de teste
   - Clique em "Salvar e Continuar"
4. Em "Tipo de aplicativo", escolha "Aplicativo da área de trabalho"
5. Digite um nome (ex: "PyWebView Sheets App")
6. Clique em "Criar"
7. Baixe o arquivo JSON das credenciais
8. Renomeie o arquivo para `credentials.json`
9. Coloque o arquivo na pasta raiz do projeto

## Passo 4: Configurar Planilha

1. Acesse [Google Sheets](https://sheets.google.com/)
2. Crie uma nova planilha
3. Renomeie para "script-rfb-teste"
4. Crie duas abas:
   - **Aba "User"** com as colunas:
     - A1: name
     - B1: cpf
     - C1: email
   - **Aba "Product"** com as colunas:
     - A1: name
     - B1: price
     - C1: description
5. Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```

## Passo 5: Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env`:

   ```bash
   cp env.example .env
   ```

2. Edite o arquivo `.env` e configure:
   ```env
   GOOGLE_SHEETS_CREDENTIALS_FILE=credentials.json
   GOOGLE_SHEETS_TOKEN_FILE=token.json
   GOOGLE_SHEETS_SPREADSHEET_ID=seu_id_da_planilha_aqui
   ```

## Passo 6: Testar Configuração

1. Execute a aplicação:

   ```bash
   python build_and_run.py
   ```

2. Na primeira execução, o navegador abrirá para autorizar o acesso
3. Faça login com sua conta Google
4. Autorize o acesso à planilha
5. O token será salvo automaticamente

## Estrutura da Planilha

### Aba "User"

```
| name        | cpf              | email                    |
|-------------|------------------|--------------------------|
| João Silva  | 12345678901      | joao@email.com           |
| Maria Santos| 98765432109      | maria@email.com          |
```

### Aba "Product"

```
| name           | price  | description                    |
|----------------|--------|--------------------------------|
| Notebook       | 2500.00| Notebook para desenvolvimento  |
| Mouse          | 50.00  | Mouse sem fio                 |
```

## Solução de Problemas

### Erro: "Arquivo de credenciais não encontrado"

- Verifique se `credentials.json` está na pasta raiz
- Confirme se o nome do arquivo está correto

### Erro: "Planilha não encontrada"

- Verifique se o ID da planilha está correto no `.env`
- Confirme se a planilha tem as abas "User" e "Product"

### Erro: "Permissão negada"

- Verifique se a Google Sheets API está ativada
- Confirme se as credenciais estão corretas
- Tente gerar novas credenciais

### Erro: "Token expirado"

- Delete o arquivo `token.json`
- Execute a aplicação novamente para reautorizar

## Segurança

⚠️ **Importante:**

- Nunca commite o arquivo `credentials.json` no Git
- Mantenha o arquivo `.env` privado
- Use contas de teste para desenvolvimento
- Configure permissões adequadas em produção

## Próximos Passos

Após configurar o Google Sheets:

1. Execute `python build_and_run.py`
2. A aplicação abrirá em uma janela PyWebView
3. Teste as funcionalidades de CRUD
4. Verifique se os dados aparecem na planilha
