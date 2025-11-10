# User Module Integration Setup Script
# Run this script from the RentMe/server directory

Write-Host "=== User Module Integration Setup ===" -ForegroundColor Green
Write-Host ""

# Step 1: Check if we're in the right directory
if (-not (Test-Path "manage.py")) {
    Write-Host "Error: manage.py not found. Please run this script from the RentMe/server directory." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Checking dependencies..." -ForegroundColor Yellow
python -m pip list | Select-String -Pattern "Django|djangorestframework|Pillow" | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "Step 2: Creating media directories..." -ForegroundColor Yellow
if (-not (Test-Path "media\profile_pictures")) {
    New-Item -ItemType Directory -Path "media\profile_pictures" -Force | Out-Null
    Write-Host "  ✓ Created media\profile_pictures directory" -ForegroundColor Green
} else {
    Write-Host "  ✓ Media directories already exist" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Running database migrations..." -ForegroundColor Yellow
Write-Host "  ⚠️  WARNING: Make sure you've backed up your database!" -ForegroundColor Red
Write-Host "  Press any key to continue with migrations, or Ctrl+C to cancel..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

python manage.py migrate accounts
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "  ✗ Migration failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start the server: python manage.py runserver"
Write-Host "  2. Test the API endpoints"
Write-Host "  3. Update your frontend to use the new user fields"
Write-Host ""

