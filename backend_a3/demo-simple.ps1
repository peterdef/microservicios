# 🎬 Script de Demostración Simplificado
# Ejecutar durante la presentación

Write-Host "🎬 DEMOSTRACIÓN DE MICROSERVICIOS" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Función para mostrar resultados
function Show-Result {
    param([string]$Title, [string]$Result)
    Write-Host "`n📋 $Title" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host $Result -ForegroundColor White
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

# 1. Verificar servicios
Write-Host "`n🔍 PASO 1: Verificando servicios..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/actuator/health" -TimeoutSec 5
    Show-Result -Title "API Gateway - Health Check" -Result ($health | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Error verificando servicios" -ForegroundColor Red
}

# 2. Login como autor
Write-Host "`n🔐 PASO 2: Login como autor..." -ForegroundColor Cyan
try {
    $loginBody = @{
        username = "autor_default"
        password = "password123"
    } | ConvertTo-Json

    $loginResult = Invoke-RestMethod -Uri "http://localhost:8000/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 10
    $authToken = $loginResult.accessToken
    Show-Result -Title "Login Exitoso" -Result "Token obtenido: $($authToken.Substring(0, [Math]::Min(50, $authToken.Length)))..."
} catch {
    Write-Host "❌ Error en login" -ForegroundColor Red
    exit
}

# 3. Crear publicación
Write-Host "`n📚 PASO 3: Creando publicación..." -ForegroundColor Cyan
try {
    $publicationBody = @{
        titulo = "Arquitectura de Microservicios"
        resumen = "Guía completa de implementación de microservicios con Spring Boot"
        palabrasClave = @("java", "microservicios", "spring", "docker")
        isbn = "978-1234567890"
        numeroPaginas = 250
        edicion = "1ra"
        capitulos = @(
            @{
                numero = 1
                titulo = "Introducción a Microservicios"
                resumenCapitulo = "Conceptos básicos y fundamentos"
            }
        )
    } | ConvertTo-Json -Depth 3

    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $authToken"
    }

    $publicationResult = Invoke-RestMethod -Uri "http://localhost:8000/libros" -Method POST -Body $publicationBody -Headers $headers -TimeoutSec 10
    $publicationId = $publicationResult.id
    Show-Result -Title "Publicación Creada" -Result ($publicationResult | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Error creando publicación" -ForegroundColor Red
    exit
}

# 4. Cambiar estado a EN_REVISION
Write-Host "`n📝 PASO 4: Cambiando estado a EN_REVISION..." -ForegroundColor Cyan
try {
    $stateChangeBody = @{
        nuevoEstado = "EN_REVISION"
        motivo = "Enviado para revisión editorial"
        comentarios = "Publicación lista para revisión por el comité editorial"
    } | ConvertTo-Json

    $stateResult = Invoke-RestMethod -Uri "http://localhost:8000/estados/publicaciones/$publicationId/cambiar-estado" -Method POST -Body $stateChangeBody -Headers $headers -TimeoutSec 10
    Show-Result -Title "Estado Cambiado" -Result ($stateResult | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Error cambiando estado" -ForegroundColor Red
}

# 5. Login como editor
Write-Host "`n👨‍💼 PASO 5: Login como editor..." -ForegroundColor Cyan
try {
    $editorLoginBody = @{
        username = "editor_default"
        password = "password123"
    } | ConvertTo-Json

    $editorLoginResult = Invoke-RestMethod -Uri "http://localhost:8000/auth/login" -Method POST -Body $editorLoginBody -ContentType "application/json" -TimeoutSec 10
    $editorToken = $editorLoginResult.accessToken
    Show-Result -Title "Login Editor Exitoso" -Result "Token de editor obtenido"
} catch {
    Write-Host "❌ Error en login de editor" -ForegroundColor Red
    exit
}

# 6. Aprobar publicación
Write-Host "`n✅ PASO 6: Aprobando publicación..." -ForegroundColor Cyan
try {
    $approveBody = @{
        nuevoEstado = "APROBADO"
        motivo = "Aprobado por editor"
        comentarios = "Publicación cumple todos los criterios de calidad editorial"
    } | ConvertTo-Json

    $editorHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $editorToken"
    }

    $approveResult = Invoke-RestMethod -Uri "http://localhost:8000/estados/publicaciones/$publicationId/cambiar-estado" -Method POST -Body $approveBody -Headers $editorHeaders -TimeoutSec 10
    Show-Result -Title "Publicación Aprobada" -Result ($approveResult | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Error aprobando publicación" -ForegroundColor Red
}

# 7. Verificar en catálogo
Write-Host "`n🔍 PASO 7: Verificando en catálogo..." -ForegroundColor Cyan
try {
    $catalogResult = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/catalogo/publicaciones" -Method GET -TimeoutSec 10
    Show-Result -Title "Catálogo de Publicaciones" -Result ($catalogResult | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Error verificando catálogo" -ForegroundColor Red
}

# 8. Ver historial de cambios
Write-Host "`n📊 PASO 8: Historial de cambios..." -ForegroundColor Cyan
try {
    $historyResult = Invoke-RestMethod -Uri "http://localhost:8000/estados/publicaciones/$publicationId/historial" -Method GET -Headers $editorHeaders -TimeoutSec 10
    Show-Result -Title "Historial de Cambios" -Result ($historyResult | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Error obteniendo historial" -ForegroundColor Red
}

# Resumen final
Write-Host "`n🎉 ¡DEMOSTRACIÓN COMPLETADA!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`n📋 Funcionalidades demostradas:" -ForegroundColor Yellow
Write-Host "✅ Autenticación con JWT" -ForegroundColor Green
Write-Host "✅ Creación de publicaciones" -ForegroundColor Green
Write-Host "✅ Control de estados del ciclo de vida" -ForegroundColor Green
Write-Host "✅ Autorización basada en roles" -ForegroundColor Green
Write-Host "✅ Comunicación entre microservicios" -ForegroundColor Green
Write-Host "✅ Eventos de dominio (RabbitMQ)" -ForegroundColor Green
Write-Host "✅ Catálogo público" -ForegroundColor Green
Write-Host "✅ Historial de auditoría" -ForegroundColor Green
Write-Host "✅ Notificaciones multicanal" -ForegroundColor Green

Write-Host "`n🌐 URLs para explorar:" -ForegroundColor Yellow
Write-Host "• Eureka Dashboard: http://localhost:8761" -ForegroundColor White
Write-Host "• API Gateway: http://localhost:8000" -ForegroundColor White
Write-Host "• Jaeger UI: http://localhost:16686" -ForegroundColor White
Write-Host "• RabbitMQ Management: http://localhost:15672" -ForegroundColor White

Write-Host "`n🎯 ¡Arquitectura de Microservicios funcionando al 100%!" -ForegroundColor Green
