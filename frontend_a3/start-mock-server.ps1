Write-Host "Starting Mock Server..." -ForegroundColor Green
Write-Host ""

Write-Host "Mock Server will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

Write-Host "Available endpoints:" -ForegroundColor White
Write-Host "- POST /api/auth/login" -ForegroundColor Gray
Write-Host "- POST /api/auth/register" -ForegroundColor Gray
Write-Host "- GET /api/auth/me" -ForegroundColor Gray
Write-Host "- GET /api/publicaciones" -ForegroundColor Gray
Write-Host "- POST /api/publicaciones" -ForegroundColor Gray
Write-Host "- PUT /api/publicaciones/:id" -ForegroundColor Gray
Write-Host "- DELETE /api/publicaciones/:id" -ForegroundColor Gray
Write-Host "- GET /api/reviews/mis-reviews" -ForegroundColor Gray
Write-Host "- POST /api/reviews" -ForegroundColor Gray
Write-Host "- PUT /api/reviews/:id" -ForegroundColor Gray
Write-Host "- GET /api/notificaciones/mis-notificaciones" -ForegroundColor Gray
Write-Host "- PUT /api/notificaciones/:id/leer" -ForegroundColor Gray
Write-Host "- GET /api/dashboard/stats" -ForegroundColor Gray
Write-Host "- GET /api/admin/users" -ForegroundColor Gray
Write-Host "- POST /api/admin/backup" -ForegroundColor Gray
Write-Host "- GET /api/admin/backups" -ForegroundColor Gray
Write-Host ""

Write-Host "Test credentials:" -ForegroundColor White
Write-Host "- autor / password" -ForegroundColor Gray
Write-Host "- revisor / password" -ForegroundColor Gray
Write-Host "- editor / password" -ForegroundColor Gray
Write-Host "- admin / password" -ForegroundColor Gray
Write-Host "- lector / password" -ForegroundColor Gray
Write-Host ""

Write-Host "Starting server..." -ForegroundColor Yellow
node mock-server.js
