"""
Aplicação Flask para API do sistema de gerenciamento
"""
import os
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import logging
import os
try:
    from .google_sheets import GoogleSheetsManager
    SHEETS_AVAILABLE = True
except ImportError:
    from .google_sheets_dev import GoogleSheetsDevManager as GoogleSheetsManager
    SHEETS_AVAILABLE = False
from .models import User, Product

# Carrega variáveis de ambiente
load_dotenv()

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializa Flask
app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app)

# Configurações
CREDENTIALS_FILE = os.getenv('GOOGLE_SHEETS_CREDENTIALS_FILE', 'credentials.json')
TOKEN_FILE = os.getenv('GOOGLE_SHEETS_TOKEN_FILE', 'token.json')
SPREADSHEET_ID = os.getenv('GOOGLE_SHEETS_SPREADSHEET_ID')

# Inicializa gerenciador do Google Sheets
try:
    if SHEETS_AVAILABLE and os.path.exists(CREDENTIALS_FILE) and SPREADSHEET_ID:
        sheets_manager = GoogleSheetsManager(
            credentials_file=CREDENTIALS_FILE,
            token_file=TOKEN_FILE,
            spreadsheet_id=SPREADSHEET_ID
        )
        logger.info("Google Sheets Manager inicializado com sucesso")
    else:
        # Usa modo de desenvolvimento
        sheets_manager = GoogleSheetsManager(
            credentials_file=CREDENTIALS_FILE,
            token_file=TOKEN_FILE,
            spreadsheet_id=SPREADSHEET_ID
        )
        logger.info("Modo de desenvolvimento ativado - usando dados simulados")
except Exception as e:
    logger.error(f"Erro ao inicializar Google Sheets Manager: {e}")
    # Fallback para modo de desenvolvimento
    sheets_manager = GoogleSheetsManager(
        credentials_file=CREDENTIALS_FILE,
        token_file=TOKEN_FILE,
        spreadsheet_id=SPREADSHEET_ID
    )
    logger.info("Fallback para modo de desenvolvimento")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica saúde da API"""
    return jsonify({
        'status': 'ok',
        'message': 'API funcionando',
        'sheets_connected': sheets_manager is not None,
        'dev_mode': not SHEETS_AVAILABLE or not os.path.exists(CREDENTIALS_FILE) or not SPREADSHEET_ID,
        'mode': 'development' if not SHEETS_AVAILABLE or not os.path.exists(CREDENTIALS_FILE) or not SPREADSHEET_ID else 'production'
    })

# ===== ROTAS PARA USUÁRIOS =====

@app.route('/api/users', methods=['GET'])
def get_users():
    """Obtém lista de usuários"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        users = sheets_manager.get_users()
        return jsonify({
            'success': True,
            'data': users,
            'count': len(users)
        })
    except Exception as e:
        logger.error(f"Erro ao obter usuários: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Cria novo usuário"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Valida dados obrigatórios
        required_fields = ['name', 'cpf', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Cria instância do usuário para validação
        try:
            user = User(name=data['name'], cpf=data['cpf'], email=data['email'])
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        # Adiciona à planilha
        success = sheets_manager.add_user(user.to_dict())
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Usuário criado com sucesso',
                'data': user.to_dict()
            }), 201
        else:
            return jsonify({'error': 'Erro ao criar usuário'}), 500
            
    except Exception as e:
        logger.error(f"Erro ao criar usuário: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<int:row_index>', methods=['PUT'])
def update_user(row_index):
    """Atualiza usuário existente"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Valida dados obrigatórios
        required_fields = ['name', 'cpf', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Cria instância do usuário para validação
        try:
            user = User(name=data['name'], cpf=data['cpf'], email=data['email'])
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        # Atualiza na planilha
        success = sheets_manager.update_user(row_index, user.to_dict())
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Usuário atualizado com sucesso',
                'data': user.to_dict()
            })
        else:
            return jsonify({'error': 'Erro ao atualizar usuário'}), 500
            
    except Exception as e:
        logger.error(f"Erro ao atualizar usuário: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<int:row_index>', methods=['DELETE'])
def delete_user(row_index):
    """Remove usuário"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        success = sheets_manager.delete_user(row_index)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Usuário removido com sucesso'
            })
        else:
            return jsonify({'error': 'Erro ao remover usuário'}), 500
            
    except Exception as e:
        logger.error(f"Erro ao remover usuário: {e}")
        return jsonify({'error': str(e)}), 500

# ===== ROTAS PARA PRODUTOS =====

@app.route('/api/products', methods=['GET'])
def get_products():
    """Obtém lista de produtos"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        products = sheets_manager.get_products()
        return jsonify({
            'success': True,
            'data': products,
            'count': len(products)
        })
    except Exception as e:
        logger.error(f"Erro ao obter produtos: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    """Cria novo produto"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Valida dados obrigatórios
        required_fields = ['name', 'price', 'description']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Cria instância do produto para validação
        try:
            product = Product(
                name=data['name'], 
                price=float(data['price']), 
                description=data['description']
            )
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        # Adiciona à planilha
        success = sheets_manager.add_product(product.to_dict())
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Produto criado com sucesso',
                'data': product.to_dict()
            }), 201
        else:
            return jsonify({'error': 'Erro ao criar produto'}), 500
            
    except Exception as e:
        logger.error(f"Erro ao criar produto: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:row_index>', methods=['PUT'])
def update_product(row_index):
    """Atualiza produto existente"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Valida dados obrigatórios
        required_fields = ['name', 'price', 'description']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Cria instância do produto para validação
        try:
            product = Product(
                name=data['name'], 
                price=float(data['price']), 
                description=data['description']
            )
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        # Atualiza na planilha
        success = sheets_manager.update_product(row_index, product.to_dict())
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Produto atualizado com sucesso',
                'data': product.to_dict()
            })
        else:
            return jsonify({'error': 'Erro ao atualizar produto'}), 500
            
    except Exception as e:
        logger.error(f"Erro ao atualizar produto: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:row_index>', methods=['DELETE'])
def delete_product(row_index):
    """Remove produto"""
    try:
        if not sheets_manager:
            return jsonify({'error': 'Google Sheets não configurado'}), 500
        
        success = sheets_manager.delete_product(row_index)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Produto removido com sucesso'
            })
        else:
            return jsonify({'error': 'Erro ao remover produto'}), 500
            
    except Exception as e:
        logger.error(f"Erro ao remover produto: {e}")
        return jsonify({'error': str(e)}), 500

# ===== ROTAS PARA SERVIR O REACT =====

@app.route('/')
def serve_react():
    """Serve a aplicação React"""
    return send_file(os.path.join(app.static_folder, 'index.html'))

@app.route('/<path:path>')
def serve_react_static(path):
    """Serve arquivos estáticos do React"""
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Para React Router, sempre retorna index.html
        return send_file(os.path.join(app.static_folder, 'index.html'))

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
