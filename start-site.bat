@echo off
REM ============================================================
REM  Corpo Leve 21D - iniciar o site localmente (Windows)
REM  Basta dar dois cliques neste arquivo.
REM ============================================================
setlocal
cd /d "%~dp0"

echo.
echo  Iniciando o site Corpo Leve 21D...
echo.

REM 1) Tenta Node.js (se estiver instalado)
where node >nul 2>nul
if %errorlevel%==0 (
  echo  Node.js encontrado. Iniciando com "npx serve" em http://localhost:5500/
  start "" "http://localhost:5500/"
  npx --yes serve . -l 5500
  goto :eof
)

REM 2) Sem Node -> usa o servidor em PowerShell (nao precisa instalar nada)
echo  Node.js nao encontrado. Usando servidor em PowerShell...
echo  O site vai abrir em http://localhost:5500/
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0start-localhost.ps1"
if %errorlevel%==0 goto :eof

REM 3) Se tudo falhar -> abre o arquivo direto no navegador
echo  Nao foi possivel subir o localhost. Abrindo index.html direto...
start "" "%~dp0index.html"

:eof
endlocal
