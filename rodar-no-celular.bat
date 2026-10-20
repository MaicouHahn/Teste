@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo.
echo ===========================================================
echo   ACOLHER - preparar e abrir no Expo Go (SDK 57)
echo ===========================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale a versao LTS em https://nodejs.org
  echo        e rode este arquivo de novo.
  pause
  exit /b 1
)

echo %CD% | findstr /i "OneDrive" >nul
if not errorlevel 1 (
  echo [AVISO] O projeto esta dentro do OneDrive. A sincronizacao pode travar o Expo.
  echo         Se continuar carregando, copie esta pasta para C:\dev\acolher
  echo         ^(sem a pasta node_modules^) e rode este arquivo de la.
  echo.
)

echo [1/5] Apagando instalacao antiga (node_modules, package-lock.json, .expo)...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /q package-lock.json
if exist .expo rmdir /s /q .expo

echo.
echo [2/5] Instalando dependencias (SDK 57)...
call npm install
if errorlevel 1 goto erro

echo.
echo [3/5] Ajustando as versoes das bibliotecas para o SDK 57...
call npx expo install --fix
if errorlevel 1 goto erro

echo.
echo [4/5] Liberando a porta 8081 no Firewall do Windows...
netsh advfirewall firewall add rule name="Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081 >nul 2>nul
if errorlevel 1 (
  echo        Sem permissao de administrador - tudo bem, o modo tunel abaixo nao precisa disso.
) else (
  echo        Porta liberada.
)

echo.
echo [5/5] Iniciando em MODO TUNEL (funciona mesmo com celular e PC em redes diferentes)
echo.
echo   No celular:
echo     1. Abra o Expo Go e toque em "Scan QR code" (no iPhone, use a camera).
echo     2. Leia o QR code que vai aparecer abaixo. A primeira abertura leva ~1 minuto.
echo.
echo   NAO aperte "a" neste terminal (isso tenta abrir um emulador e da erro de adb).
echo.
call npx expo start --tunnel -c
goto fim

:erro
echo.
echo [ERRO] Algo deu errado no passo acima. Copie a mensagem de erro e envie para a equipe.
pause
exit /b 1

:fim
endlocal
