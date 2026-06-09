# start-localhost.ps1
# Servidor local simples para o site Corpo Leve 21D.
# Nao precisa de Python nem Node. Usa apenas .NET (ja vem no Windows).
# Serve a pasta deste arquivo em http://localhost:5500/
# Encerrar: feche a janela ou pressione Ctrl+C.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5500
$url  = "http://localhost:$port/"

# Tipos de arquivo (MIME)
$mime = @{
  ".html"="text/html; charset=utf-8"; ".htm"="text/html; charset=utf-8";
  ".css"="text/css; charset=utf-8";   ".js"="application/javascript; charset=utf-8";
  ".json"="application/json; charset=utf-8";
  ".png"="image/png";  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".gif"="image/gif";  ".webp"="image/webp"; ".svg"="image/svg+xml";
  ".ico"="image/x-icon"; ".woff"="font/woff"; ".woff2"="font/woff2";
  ".ttf"="font/ttf"; ".txt"="text/plain; charset=utf-8";
  ".pdf"="application/pdf"; ".map"="application/json"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
try {
  $listener.Start()
} catch {
  Write-Host ""
  Write-Host "Nao foi possivel iniciar o servidor em $url" -ForegroundColor Red
  Write-Host "Talvez a porta $port ja esteja em uso. Abrindo o site direto no navegador..." -ForegroundColor Yellow
  Start-Process (Join-Path $root "index.html")
  exit 1
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host " Corpo Leve 21D - servidor local ativo" -ForegroundColor Green
Write-Host " Pasta: $root"
Write-Host " Abra no navegador: $url" -ForegroundColor Cyan
Write-Host " Para encerrar: feche esta janela ou Ctrl+C"
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Abre o navegador automaticamente (se falhar, segue servindo mesmo assim)
try { Start-Process $url } catch { Write-Host "Abra manualmente no navegador: $url" -ForegroundColor Cyan }

while ($listener.IsListening) {
  # Aguarda a proxima requisicao. Se o listener for parado (Ctrl+C), sai do laco.
  try {
    $context = $listener.GetContext()
  } catch {
    break
  }

  # Trata a requisicao. Um erro aqui (ex.: navegador cancelou) NAO derruba o servidor.
  try {
    $request  = $context.Request
    $response = $context.Response

    $rel = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct  = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $response.ContentType = $ct
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host ("200  /" + $rel)
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - arquivo nao encontrado: $rel")
      $response.OutputStream.Write($msg, 0, $msg.Length)
      Write-Host ("404  /" + $rel) -ForegroundColor Yellow
    }
    $response.OutputStream.Close()
  } catch {
    # Conexao interrompida pelo navegador: ignora e continua servindo.
    try { $context.Response.Abort() } catch {}
  }
}

$listener.Stop()
$listener.Close()
Write-Host "Servidor encerrado." -ForegroundColor Yellow
