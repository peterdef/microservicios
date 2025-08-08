Write-Host "Starting development environment with dynamic data persistence..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting mock server with data persistence and automatic backups..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node mock-server.js" -WindowStyle Normal

Write-Host "Waiting for mock server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting frontend development server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Development environment started with dynamic data persistence!" -ForegroundColor Green
Write-Host ""
Write-Host "Mock Server: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Data Persistence Features:" -ForegroundColor White
Write-Host "- Automatic data saving to JSON files" -ForegroundColor Gray
Write-Host "- Automatic backup creation" -ForegroundColor Gray
Write-Host "- Dynamic dashboard with real-time data" -ForegroundColor Gray
Write-Host "- Complete CRUD operations" -ForegroundColor Gray
Write-Host "- User registration and management" -ForegroundColor Gray
Write-Host "- Publication creation and editing" -ForegroundColor Gray
Write-Host "- Review assignment and management" -ForegroundColor Gray
Write-Host "- Notification system" -ForegroundColor Gray
Write-Host ""
Write-Host "Backup System Features:" -ForegroundColor White
Write-Host "- Automatic backups every 10 operations" -ForegroundColor Gray
Write-Host "- Manual backup creation" -ForegroundColor Gray
Write-Host "- Backup restoration functionality" -ForegroundColor Gray
Write-Host "- Backup deletion and cleanup" -ForegroundColor Gray
Write-Host "- Data export and import" -ForegroundColor Gray
Write-Host "- System statistics and monitoring" -ForegroundColor Gray
Write-Host ""
Write-Host "Data Storage:" -ForegroundColor White
Write-Host "- Users: data/users.json" -ForegroundColor Gray
Write-Host "- Publications: data/publications.json" -ForegroundColor Gray
Write-Host "- Reviews: data/reviews.json" -ForegroundColor Gray
Write-Host "- Notifications: data/notifications.json" -ForegroundColor Gray
Write-Host "- Backups: data/backups/" -ForegroundColor Gray
Write-Host ""
Write-Host "Admin Panel Features:" -ForegroundColor White
Write-Host "- Dashboard with real-time statistics" -ForegroundColor Gray
Write-Host "- Backup management (create, restore, delete)" -ForegroundColor Gray
Write-Host "- System health monitoring" -ForegroundColor Gray
Write-Host "- Data export and import" -ForegroundColor Gray
Write-Host "- User management (coming soon)" -ForegroundColor Gray
Write-Host "- System configuration" -ForegroundColor Gray
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor White
Write-Host "- autor / password" -ForegroundColor Gray
Write-Host "- revisor / password" -ForegroundColor Gray
Write-Host "- editor / password" -ForegroundColor Gray
Write-Host "- admin / password" -ForegroundColor Gray
Write-Host "- lector / password" -ForegroundColor Gray
Write-Host ""
Write-Host "Admin Features:" -ForegroundColor White
Write-Host "- User management" -ForegroundColor Gray
Write-Host "- Manual backup creation" -ForegroundColor Gray
Write-Host "- Backup restoration and deletion" -ForegroundColor Gray
Write-Host "- Backup history viewing" -ForegroundColor Gray
Write-Host "- System statistics" -ForegroundColor Gray
Write-Host "- Data export/import" -ForegroundColor Gray
Write-Host "- System health monitoring" -ForegroundColor Gray
Write-Host ""
Write-Host "API Endpoints Added:" -ForegroundColor White
Write-Host "- POST /api/admin/backup (create backup)" -ForegroundColor Gray
Write-Host "- GET /api/admin/backups (list backups)" -ForegroundColor Gray
Write-Host "- POST /api/admin/backup/restore/:name (restore backup)" -ForegroundColor Gray
Write-Host "- DELETE /api/admin/backup/:name (delete backup)" -ForegroundColor Gray
Write-Host "- POST /api/admin/export (export data)" -ForegroundColor Gray
Write-Host "- POST /api/admin/import (import data)" -ForegroundColor Gray
Write-Host "- GET /api/admin/stats (system statistics)" -ForegroundColor Gray
Write-Host "- POST /api/admin/backup/clean (clean old backups)" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to continue..."
