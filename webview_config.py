"""
Configurações específicas para PyWebView
"""
import webview

def configure_webview():
    """Configura PyWebView com as melhores práticas"""
    
    # Configurações globais do PyWebView
    webview.settings = {
        'ALLOW_DOWNLOADS': False,  # Não permite downloads
        'ALLOW_FILE_URLS': True,   # Permite acesso a arquivos locais
        'OPEN_EXTERNAL_LINKS_IN_BROWSER': True,  # Abre links externos no navegador
        'OPEN_DEVTOOLS_IN_DEBUG': False,  # Abre DevTools em modo debug
        'REMOTE_DEBUGGING_PORT': 9222,  # Porta para debug remoto
    }
    
    # Configurações de segurança
    webview.settings.update({
        'PRIVATE_MODE': True,  # Modo privado por padrão
        'STORAGE_PATH': None,  # Sem armazenamento persistente
    })

def create_window(title, url, width=1200, height=800):
    """Cria janela PyWebView com configurações otimizadas"""
    
    return webview.create_window(
        title=title,
        url=url,
        width=width,
        height=height,
        min_size=(800, 600),
        resizable=True,
        fullscreen=False,
        on_top=False,
        focus=True,
        background_color='#f8fafc',  # Cor de fundo enquanto carrega
        text_select=True,  # Permite seleção de texto
        zoomable=True,  # Permite zoom
        draggable=False,  # Não permite arrastar elementos
        vibrancy=False,  # Efeito de vibrancy (macOS)
        transparent=False,  # Janela não transparente
        frameless=False,  # Com bordas da janela
        easy_drag=True,  # Arrastar fácil para janelas sem borda
    )

def start_webview(debug=False):
    """Inicia PyWebView com configurações otimizadas"""
    
    # Configura webview
    configure_webview()
    
    # Inicia com debug se solicitado
    webview.start(debug=debug)
