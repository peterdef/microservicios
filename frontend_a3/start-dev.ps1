Write-Host "Starting development environment..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting mock server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node mock-server.js" -WindowStyle Normal

Write-Host "Waiting for mock server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting frontend development server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "Mock Server: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor White
Write-Host "- autor / password" -ForegroundColor Gray
Write-Host "- revisor / password" -ForegroundColor Gray
Write-Host "- editor / password" -ForegroundColor Gray
Write-Host "- admin / password" -ForegroundColor Gray
Write-Host "- lector / password" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to continue..."
