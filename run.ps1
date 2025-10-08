# Script para executar comandos com venv ativado automaticamente
param(
    [Parameter(Position=0)]
    [string]$Command = "main"
)

# Ativa o ambiente virtual
Write-Host "Ativando ambiente virtual..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

switch ($Command.ToLower()) {
    "main" {
        Write-Host "Executando aplicação principal..." -ForegroundColor Green
        python main.py
    }
    "build" {
        Write-Host "Executando build completo..." -ForegroundColor Green
        python build_and_run.py
    }
    "install" {
        Write-Host "Instalando dependências..." -ForegroundColor Green
        python -m pip install -r requirements.txt
    }
    "update" {
        Write-Host "Atualizando pip e dependências..." -ForegroundColor Green
        python -m pip install --upgrade pip
        python -m pip install --upgrade -r requirements.txt
    }
    "test" {
        Write-Host "Testando ambiente..." -ForegroundColor Green
        python -c "import webview, flask, backend.app; print('✅ Todas as dependências OK')"
    }
    "shell" {
        Write-Host "Abrindo shell Python no venv..." -ForegroundColor Green
        python
    }
    default {
        Write-Host "Executando comando personalizado: $Command" -ForegroundColor Green
        Invoke-Expression $Command
    }
}