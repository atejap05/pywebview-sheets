#!/usr/bin/env python3
"""
Script para ativar o ambiente virtual e executar comandos Python
"""
import os
import sys
import subprocess
from pathlib import Path

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
    """Verifica se o ambiente virtual existe"""
    python_cmd = get_python_executable()
    return os.path.exists(python_cmd)

def show_help():
    """Mostra ajuda do script"""
    print("🔧 Ativador do Ambiente Virtual - PyWebView Sheets")
    print("=" * 50)
    print("Uso:")
    print("  python activate_env.py [comando]")
    print("")
    print("Comandos disponíveis:")
    print("  run          - Executa a aplicação principal")
    print("  install      - Instala dependências Python")
    print("  shell        - Abre shell Python no ambiente virtual")
    print("  pip [args]   - Executa pip com argumentos")
    print("  python [args]- Executa python com argumentos")
    print("  info         - Mostra informações do ambiente")
    print("  help         - Mostra esta ajuda")
    print("")
    print("Exemplos:")
    print("  python activate_env.py run")
    print("  python activate_env.py install")
    print("  python activate_env.py pip list")
    print("  python activate_env.py python -c 'import webview; print(webview.__version__)'")

def show_info():
    """Mostra informações do ambiente virtual"""
    if not check_virtual_env():
        print("❌ Ambiente virtual não encontrado!")
        print("Execute primeiro: python build_and_run.py")
        return
    
    python_cmd = get_python_executable()
    pip_cmd = get_pip_executable()
    
    print("📊 Informações do Ambiente Virtual")
    print("=" * 40)
    print(f"🐍 Python: {python_cmd}")
    print(f"📦 Pip: {pip_cmd}")
    print(f"📁 Diretório: {os.path.abspath('venv')}")
    
    # Verifica versão do Python
    try:
        result = subprocess.run([python_cmd, "--version"], capture_output=True, text=True)
        print(f"🔢 Versão: {result.stdout.strip()}")
    except:
        print("❌ Erro ao obter versão do Python")
    
    # Lista pacotes instalados
    try:
        result = subprocess.run([pip_cmd, "list"], capture_output=True, text=True)
        packages = [line.split()[0] for line in result.stdout.split('\n')[2:] if line.strip()]
        print(f"📦 Pacotes instalados: {len(packages)}")
        if packages:
            print("   Principais:", ", ".join(packages[:5]))
            if len(packages) > 5:
                print(f"   ... e mais {len(packages) - 5} pacotes")
    except:
        print("❌ Erro ao listar pacotes")

def run_command(cmd_args):
    """Executa comando no ambiente virtual"""
    if not check_virtual_env():
        print("❌ Ambiente virtual não encontrado!")
        print("Execute primeiro: python build_and_run.py")
        return False
    
    python_cmd = get_python_executable()
    pip_cmd = get_pip_executable()
    
    # Determina qual comando usar
    if cmd_args[0] == "pip":
        full_cmd = [pip_cmd] + cmd_args[1:]
    elif cmd_args[0] == "python":
        full_cmd = [python_cmd] + cmd_args[1:]
    else:
        # Comando personalizado
        full_cmd = [python_cmd] + cmd_args
    
    try:
        print(f"🚀 Executando: {' '.join(full_cmd)}")
        result = subprocess.run(full_cmd, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar comando: {e}")
        return False
    except KeyboardInterrupt:
        print("\n👋 Comando interrompido pelo usuário")
        return False

def main():
    """Função principal"""
    if len(sys.argv) < 2:
        show_help()
        return 1
    
    command = sys.argv[1].lower()
    args = sys.argv[2:]
    
    if command == "help":
        show_help()
        return 0
    elif command == "info":
        show_info()
        return 0
    elif command == "run":
        return 0 if run_command(["main.py"]) else 1
    elif command == "install":
        return 0 if run_command(["pip", "install", "-r", "requirements.txt"]) else 1
    elif command == "shell":
        return 0 if run_command([]) else 1
    elif command in ["pip", "python"]:
        return 0 if run_command(sys.argv[1:]) else 1
    else:
        # Comando personalizado
        return 0 if run_command(sys.argv[1:]) else 1

if __name__ == '__main__':
    sys.exit(main())
