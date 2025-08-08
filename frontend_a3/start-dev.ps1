# Script de inicio para el sistema de gestión de publicaciones académicas
# Con funcionalidad completa de datos mock y flujo real

Write-Host "🚀 Iniciando Sistema de Gestión de Publicaciones Académicas" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor, instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar si npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Configurando datos mock..." -ForegroundColor Yellow

# Crear archivo de configuración temporal para datos mock
$mockConfig = @"
// Configuración de datos mock para simulación real
window.MOCK_CONFIG = {
  enableRealFlow: true,
  simulateDelays: true,
  autoIncrementStats: true,
  enableNotifications: true,
  dataPersistence: true
};
"@

$mockConfig | Out-File -FilePath "public/mock-config.js" -Encoding UTF8

Write-Host ""
Write-Host "🌐 Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host "📍 URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Credenciales de prueba disponibles:" -ForegroundColor Green
Write-Host "   👤 Autor: autor@test.com / password" -ForegroundColor White
Write-Host "   👤 Revisor: revisor@test.com / password" -ForegroundColor White
Write-Host "   👤 Editor: editor@test.com / password" -ForegroundColor White
Write-Host "   👤 Admin: admin@test.com / password" -ForegroundColor White
Write-Host "   👤 Lector: lector@test.com / password" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Funcionalidades disponibles:" -ForegroundColor Green
Write-Host "   ✅ Autenticación completa con datos mock" -ForegroundColor White
Write-Host "   ✅ Gestión de publicaciones con flujo real" -ForegroundColor White
Write-Host "   ✅ Sistema de revisiones simulado" -ForegroundColor White
Write-Host "   ✅ Notificaciones en tiempo real" -ForegroundColor White
Write-Host "   ✅ Panel de administración completo" -ForegroundColor White
Write-Host "   ✅ Texto negro en todos los campos de entrada" -ForegroundColor White
Write-Host "   ✅ Persistencia de datos en localStorage" -ForegroundColor White
Write-Host "   ✅ Exportación/Importación de datos" -ForegroundColor White

Write-Host ""
Write-Host "🔄 Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""

# Iniciar el servidor de desarrollo
npm run dev
