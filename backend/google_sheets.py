"""
Integração com Google Sheets API
"""
import os
import pickle
from typing import List, Optional, Dict, Any
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Escopo necessário para acessar Google Sheets
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

class GoogleSheetsManager:
    """Gerenciador para operações com Google Sheets"""
    
    def __init__(self, credentials_file: str = 'credentials.json', 
                 token_file: str = 'token.json',
                 spreadsheet_id: str = None):
        self.credentials_file = credentials_file
        self.token_file = token_file
        self.spreadsheet_id = spreadsheet_id
        self.service = None
        self._authenticate()
    
    def _authenticate(self):
        """Autentica com Google Sheets API"""
        creds = None
        
        # Carrega token existente se disponível
        if os.path.exists(self.token_file):
            with open(self.token_file, 'rb') as token:
                creds = pickle.load(token)
        
        # Se não há credenciais válidas, solicita autorização
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(self.credentials_file):
                    raise FileNotFoundError(
                        f"Arquivo de credenciais '{self.credentials_file}' não encontrado. "
                        "Baixe o arquivo JSON do Google Cloud Console."
                    )
                
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_file, SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Salva credenciais para próxima execução
            with open(self.token_file, 'wb') as token:
                pickle.dump(creds, token)
        
        self.service = build('sheets', 'v4', credentials=creds)
        logger.info("Autenticação com Google Sheets realizada com sucesso")
    
    def get_sheet_data(self, sheet_name: str, range_name: str = None) -> List[List[str]]:
        """Obtém dados de uma planilha"""
        try:
            if range_name:
                range_str = f"{sheet_name}!{range_name}"
            else:
                range_str = sheet_name
            
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_str
            ).execute()
            
            values = result.get('values', [])
            logger.info(f"Dados obtidos da planilha {sheet_name}: {len(values)} linhas")
            return values
            
        except HttpError as error:
            logger.error(f"Erro ao obter dados da planilha: {error}")
            raise
    
    def update_sheet_data(self, sheet_name: str, values: List[List[str]], 
                         range_name: str = None) -> Dict[str, Any]:
        """Atualiza dados em uma planilha"""
        try:
            if range_name:
                range_str = f"{sheet_name}!{range_name}"
            else:
                range_str = sheet_name
            
            body = {'values': values}
            result = self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range=range_str,
                valueInputOption='RAW',
                body=body
            ).execute()
            
            logger.info(f"Dados atualizados na planilha {sheet_name}")
            return result
            
        except HttpError as error:
            logger.error(f"Erro ao atualizar dados da planilha: {error}")
            raise
    
    def append_sheet_data(self, sheet_name: str, values: List[List[str]]) -> Dict[str, Any]:
        """Adiciona dados ao final de uma planilha"""
        try:
            range_str = sheet_name
            
            body = {'values': values}
            result = self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=range_str,
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body=body
            ).execute()
            
            logger.info(f"Dados adicionados à planilha {sheet_name}")
            return result
            
        except HttpError as error:
            logger.error(f"Erro ao adicionar dados à planilha: {error}")
            raise
    
    def delete_sheet_row(self, sheet_name: str, row_index: int) -> Dict[str, Any]:
        """Remove uma linha da planilha"""
        try:
            # Obtém informações da planilha
            sheet_metadata = self.service.spreadsheets().get(
                spreadsheetId=self.spreadsheet_id
            ).execute()
            
            # Encontra o ID da aba
            sheet_id = None
            for sheet in sheet_metadata['sheets']:
                if sheet['properties']['title'] == sheet_name:
                    sheet_id = sheet['properties']['sheetId']
                    break
            
            if sheet_id is None:
                raise ValueError(f"Aba '{sheet_name}' não encontrada")
            
            # Remove a linha
            request_body = {
                'requests': [{
                    'deleteDimension': {
                        'range': {
                            'sheetId': sheet_id,
                            'dimension': 'ROWS',
                            'startIndex': row_index - 1,  # Google Sheets usa índice baseado em 0
                            'endIndex': row_index
                        }
                    }
                }]
            }
            
            result = self.service.spreadsheets().batchUpdate(
                spreadsheetId=self.spreadsheet_id,
                body=request_body
            ).execute()
            
            logger.info(f"Linha {row_index} removida da planilha {sheet_name}")
            return result
            
        except HttpError as error:
            logger.error(f"Erro ao remover linha da planilha: {error}")
            raise
    
    def get_users(self) -> List[Dict[str, Any]]:
        """Obtém lista de usuários da planilha"""
        try:
            data = self.get_sheet_data('User', 'A2:D')  # Pula cabeçalho
            users = []
            
            for i, row in enumerate(data, start=2):  # Começa na linha 2 (após cabeçalho)
                if len(row) >= 3:  # name, cpf, email
                    users.append({
                        'name': row[0] if len(row) > 0 else '',
                        'cpf': row[1] if len(row) > 1 else '',
                        'email': row[2] if len(row) > 2 else '',
                        'row_index': i
                    })
            
            return users
            
        except Exception as e:
            logger.error(f"Erro ao obter usuários: {e}")
            return []
    
    def get_products(self) -> List[Dict[str, Any]]:
        """Obtém lista de produtos da planilha"""
        try:
            data = self.get_sheet_data('Product', 'A2:D')  # Pula cabeçalho
            products = []
            
            for i, row in enumerate(data, start=2):  # Começa na linha 2 (após cabeçalho)
                if len(row) >= 3:  # name, price, description
                    # Converte preço de string para float, tratando vírgula como separador decimal
                    price_str = row[1] if len(row) > 1 and row[1] else '0'
                    price_str = price_str.replace(',', '.')  # Converte vírgula para ponto
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 0.0
                    
                    products.append({
                        'name': row[0] if len(row) > 0 else '',
                        'price': price,
                        'description': row[2] if len(row) > 2 else '',
                        'row_index': i
                    })
            
            return products
            
        except Exception as e:
            logger.error(f"Erro ao obter produtos: {e}")
            return []
    
    def add_user(self, user_data: Dict[str, Any]) -> bool:
        """Adiciona um novo usuário"""
        try:
            values = [[user_data['name'], user_data['cpf'], user_data['email']]]
            self.append_sheet_data('User', values)
            return True
        except Exception as e:
            logger.error(f"Erro ao adicionar usuário: {e}")
            return False
    
    def add_product(self, product_data: Dict[str, Any]) -> bool:
        """Adiciona um novo produto"""
        try:
            values = [[product_data['name'], product_data['price'], product_data['description']]]
            self.append_sheet_data('Product', values)
            return True
        except Exception as e:
            logger.error(f"Erro ao adicionar produto: {e}")
            return False
    
    def update_user(self, row_index: int, user_data: Dict[str, Any]) -> bool:
        """Atualiza um usuário existente"""
        try:
            range_name = f"A{row_index}:C{row_index}"
            values = [[user_data['name'], user_data['cpf'], user_data['email']]]
            self.update_sheet_data('User', values, range_name)
            return True
        except Exception as e:
            logger.error(f"Erro ao atualizar usuário: {e}")
            return False
    
    def update_product(self, row_index: int, product_data: Dict[str, Any]) -> bool:
        """Atualiza um produto existente"""
        try:
            range_name = f"A{row_index}:C{row_index}"
            values = [[product_data['name'], product_data['price'], product_data['description']]]
            self.update_sheet_data('Product', values, range_name)
            return True
        except Exception as e:
            logger.error(f"Erro ao atualizar produto: {e}")
            return False
    
    def delete_user(self, row_index: int) -> bool:
        """Remove um usuário"""
        try:
            self.delete_sheet_row('User', row_index)
            return True
        except Exception as e:
            logger.error(f"Erro ao remover usuário: {e}")
            return False
    
    def delete_product(self, row_index: int) -> bool:
        """Remove um produto"""
        try:
            self.delete_sheet_row('Product', row_index)
            return True
        except Exception as e:
            logger.error(f"Erro ao remover produto: {e}")
            return False
