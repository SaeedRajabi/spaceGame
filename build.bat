@echo off
echo Building Android Game...
echo =======================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

REM Check if Cordova is installed
cordova --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Cordova CLI...
    npm install -g cordova
    if %errorlevel% neq 0 (
        echo Error: Failed to install Cordova CLI
        pause
        exit /b
    )
)

REM Install project dependencies
echo Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install project dependencies
    pause
    exit /b
)

REM Generate app icons
echo Generating app icons...
node simple-icon.js
if %errorlevel% neq 0 (
    echo Warning: Failed to generate app icons
)

REM Add Android platform if not already added
echo Adding Android platform...
cordova platform add android
if %errorlevel% neq 0 (
    echo Error: Failed to add Android platform
    pause
    exit /b
)

REM Build the Android app
echo Building Android app...
cordova build android
if %errorlevel% neq 0 (
    echo Error: Failed to build Android app
    pause
    exit /b
)

echo.
echo Build completed successfully!
echo APK file location: platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause