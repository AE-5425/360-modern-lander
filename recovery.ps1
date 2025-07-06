# Healthcare Finder - Emergency Recovery Script
# Save this as recovery.ps1 and run in PowerShell from your project root directory

Write-Host "🚨 Healthcare Finder Emergency Recovery Starting..." -ForegroundColor Yellow
Write-Host "This will clean all caches and reinstall dependencies" -ForegroundColor Yellow

# Stop any running dev servers
Write-Host "📱 Stopping any running dev servers..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear all npm/yarn caches
Write-Host "🧹 Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Remove node_modules and lock files
Write-Host "🗑️ Removing node_modules and lock files..." -ForegroundColor Cyan
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
if (Test-Path "yarn.lock") { Remove-Item -Force "yarn.lock" }

# Clear Vite cache
Write-Host "⚡ Clearing Vite cache..." -ForegroundColor Cyan
if (Test-Path ".vite") { Remove-Item -Recurse -Force ".vite" }
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

# Clear browser caches (Chrome dev tools cache)
Write-Host "🌐 Instructions for browser cache..." -ForegroundColor Cyan
Write-Host "  → After this script, open Chrome DevTools (F12)" -ForegroundColor Yellow
Write-Host "  → Right-click the refresh button and select 'Empty Cache and Hard Reload'" -ForegroundColor Yellow

# Backup current package.json
Write-Host "💾 Backing up current package.json..." -ForegroundColor Cyan
if (Test-Path "package.json") { 
    Copy-Item "package.json" "package.json.backup"
    Write-Host "  ✅ Backup saved as package.json.backup" -ForegroundColor Green
}

Write-Host "📦 Ready to install clean dependencies..." -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Replace your package.json with the clean version from the artifact" -ForegroundColor White
Write-Host "2. Replace your vite.config.ts with the emergency version from the artifact" -ForegroundColor White  
Write-Host "3. Add the emergency CSS to the end of your src/index.css file" -ForegroundColor White
Write-Host "4. Run: npm install" -ForegroundColor White
Write-Host "5. Run: npm run dev -- --force" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Expected Result: Sub-3 second refresh times!" -ForegroundColor Green

# Optional: Auto-install if user confirms
$install = Read-Host "Would you like to auto-install clean dependencies now? (y/n)"
if ($install -eq "y" -or $install -eq "Y") {
    Write-Host "🔄 Installing clean dependencies..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Installation complete!" -ForegroundColor Green
        Write-Host "🚀 Starting dev server..." -ForegroundColor Cyan
        npm run dev
    } else {
        Write-Host "❌ Installation failed. Please run 'npm install' manually." -ForegroundColor Red
    }
} else {
    Write-Host "👍 Recovery preparation complete. Run the manual steps above." -ForegroundColor Green
}