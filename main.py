"""
Aplicação principal PyWebView + React + Google Sheets
"""
import os
import sys
import threading
import time
import webbrowser
from flask import Flask
import webview
from backend.app import app as flask_app
from webview_config import create_window, start_webview

class PyWebViewApp:
    """Classe principal da aplicação PyWebView"""
    
    def __init__(self):
        self.window = None
        self.flask_thread = None
        self.flask_app = flask_app
    
    def start_flask_server(self):
        """Inicia servidor Flask em thread separada"""
        try:
            self.flask_app.run(debug=False, host='127.0.0.1', port=5001, use_reloader=False)
        except Exception as e:
            print(f"Erro ao iniciar servidor Flask: {e}")
    
    def check_flask_ready(self):
        """Verifica se o Flask está pronto"""
        import requests
        try:
            response = requests.get('http://127.0.0.1:5001/api/health', timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def wait_for_flask(self, timeout=10):
        """Aguarda Flask ficar pronto"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            if self.check_flask_ready():
                return True
            time.sleep(0.5)
        return False
    
    def create_window(self):
        """Cria janela PyWebView"""
        # Inicia Flask em thread separada
        self.flask_thread = threading.Thread(target=self.start_flask_server, daemon=True)
        self.flask_thread.start()
        
        # Aguarda Flask ficar pronto
        if not self.wait_for_flask():
            print("Erro: Flask não iniciou a tempo")
            return
        
        # Cria janela PyWebView com configurações otimizadas
        self.window = create_window(
            title='Sistema de Gerenciamento - PyWebView + React + Google Sheets',
            url='http://127.0.0.1:5001',
            width=1200,
            height=800
        )
    
    def run(self):
        """Executa a aplicação"""
        try:
            print("Iniciando aplicação PyWebView...")
            print("Configurando servidor Flask...")
            
            self.create_window()
            
            if self.window:
                print("Iniciando interface PyWebView...")
                print("Aplicação rodando! Feche a janela para sair.")
                start_webview(debug=True)
            else:
                print("Erro: Não foi possível criar a janela")
                
        except KeyboardInterrupt:
            print("\nAplicação interrompida pelo usuário")
        except Exception as e:
            print(f"Erro na aplicação: {e}")
        finally:
            print("Encerrando aplicação...")

def main():
    """Função principal"""
    # Verifica se as dependências estão instaladas
    try:
        import flask
        import webview
        from backend.app import app
    except ImportError as e:
        print(f"Erro: Dependência não encontrada: {e}")
        print("Execute: pip install -r requirements.txt")
        return
    
    # Verifica se o arquivo de credenciais existe
    if not os.path.exists('credentials.json'):
        print("AVISO: Arquivo 'credentials.json' não encontrado!")
        print("Configure suas credenciais do Google Sheets API primeiro.")
        print("Veja o README.md para instruções detalhadas.")
        
        # Pergunta se quer continuar mesmo assim
        response = input("Deseja continuar mesmo assim? (s/N): ").lower()
        if response != 's':
            return
    
    # Inicia aplicação
    app_instance = PyWebViewApp()
    app_instance.run()

if __name__ == '__main__':
    main()
