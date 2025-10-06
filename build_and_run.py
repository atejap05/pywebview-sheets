#!/usr/bin/env python3
"""
Script para build do React e execução da aplicação PyWebView
"""
import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Executa comando e retorna resultado"""
    try:
        result = subprocess.run(
            command, 
            cwd=cwd, 
            shell=shell, 
            check=True, 
            capture_output=True, 
            text=True
        )
        print(f"✅ {command}")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar: {command}")
        print(f"Erro: {e.stderr}")
        return False

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    print("🔍 Verificando dependências...")
    
    # Verifica Python
    if not shutil.which('python') and not shutil.which('python3'):
        print("❌ Python não encontrado")
        return False
    
    # Verifica Node.js
    if not shutil.which('node'):
        print("❌ Node.js não encontrado")
        print("Instale Node.js: https://nodejs.org/")
        return False
    
    # Verifica npm
    if not shutil.which('npm'):
        print("❌ npm não encontrado")
        return False
    
    print("✅ Dependências encontradas")
    return True

def create_virtual_env():
    """Cria ambiente virtual Python se não existir"""
    venv_path = Path("venv")
    
    if venv_path.exists():
        print("✅ Ambiente virtual já existe")
        return True
    
    print("📦 Criando ambiente virtual Python...")
    try:
        # Tenta usar python3 primeiro, depois python
        python_cmd = "python3" if shutil.which('python3') else "python"
        result = subprocess.run(
            [python_cmd, "-m", "venv", "venv"],
            check=True,
            capture_output=True,
            text=True
        )
        print("✅ Ambiente virtual criado com sucesso")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao criar ambiente virtual: {e.stderr}")
        return False

def get_python_executable():
    """Retorna o caminho para o executável Python do ambiente virtual"""
    if os.name == 'nt':  # Windows
        return "venv\\Scripts\\python.exe"
    else:  # Unix/Linux/macOS
        return "venv/bin/python"

def get_pip_executable():
    """Retorna o caminho para o pip do ambiente virtual"""
    if os.name == 'nt':  # Windows
        return "venv\\Scripts\\pip.exe"
    else:  # Unix/Linux/macOS
        return "venv/bin/pip"

def check_virtual_env():
    """Verifica se o ambiente virtual está configurado corretamente"""
    python_cmd = get_python_executable()
    pip_cmd = get_pip_executable()
    
    # Verifica se os executáveis existem
    if not os.path.exists(python_cmd):
        print(f"❌ Python do ambiente virtual não encontrado: {python_cmd}")
        return False
    
    if not os.path.exists(pip_cmd):
        print(f"❌ Pip do ambiente virtual não encontrado: {pip_cmd}")
        return False
    
    print("✅ Ambiente virtual configurado corretamente")
    return True

def install_python_deps():
    """Instala dependências Python no ambiente virtual"""
    print("📦 Instalando dependências Python no ambiente virtual...")
    pip_cmd = get_pip_executable()
    return run_command(f"{pip_cmd} install -r requirements.txt")

def install_react_deps():
    """Instala dependências React"""
    print("📦 Instalando dependências React...")
    return run_command("npm install", cwd="frontend")

def build_react():
    """Faz build do React"""
    print("🏗️ Fazendo build do React...")
    return run_command("npm run build", cwd="frontend")

def run_application():
    """Executa a aplicação usando o ambiente virtual"""
    print("🚀 Iniciando aplicação...")
    python_cmd = get_python_executable()
    return run_command(f"{python_cmd} main.py")

def main():
    """Função principal"""
    print("🎯 PyWebView + React + Google Sheets")
    print("=" * 50)
    
    # Verifica se estamos no diretório correto
    if not os.path.exists('main.py'):
        print("❌ Execute este script na pasta raiz do projeto")
        return 1
    
    # Verifica dependências
    if not check_dependencies():
        return 1
    
    # Cria ambiente virtual
    if not create_virtual_env():
        print("❌ Falha ao criar ambiente virtual")
        return 1
    
    # Verifica ambiente virtual
    if not check_virtual_env():
        print("❌ Ambiente virtual não está configurado corretamente")
        return 1
    
    # Instala dependências Python
    if not install_python_deps():
        print("❌ Falha ao instalar dependências Python")
        return 1
    
    # Instala dependências React
    if not install_react_deps():
        print("❌ Falha ao instalar dependências React")
        return 1
    
    # Faz build do React
    if not build_react():
        print("❌ Falha ao fazer build do React")
        return 1
    
    # Verifica se o build foi criado
    if not os.path.exists('frontend/build'):
        print("❌ Build do React não foi criado")
        return 1
    
    print("✅ Build concluído com sucesso!")
    print("\n" + "="*50)
    print("🎯 CONFIGURAÇÃO COMPLETA!")
    print("="*50)
    print(f"📁 Ambiente virtual: {os.path.abspath('venv')}")
    print(f"🐍 Python: {get_python_executable()}")
    print(f"📦 Pip: {get_pip_executable()}")
    print(f"⚛️  React build: {os.path.abspath('frontend/build')}")
    print("="*50)
    print("🚀 Iniciando aplicação...")
    print("💡 Dica: Para executar manualmente, use:")
    print(f"   {get_python_executable()} main.py")
    print("="*50)
    
    # Executa aplicação
    try:
        run_application()
    except KeyboardInterrupt:
        print("\n👋 Aplicação encerrada pelo usuário")
        return 0
    except Exception as e:
        print(f"❌ Erro ao executar aplicação: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
