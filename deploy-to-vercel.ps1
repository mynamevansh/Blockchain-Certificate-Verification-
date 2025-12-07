# Vercel Deployment Script
# Run this script to deploy the frontend to Vercel

Write-Host "🚀 Certificate Verification System - Vercel Deployment" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "📦 Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔨 Building frontend to verify everything works..." -ForegroundColor Yellow
Set-Location -Path "client"

# Run build
Write-Host "Running npm run build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix errors before deploying." -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "🎯 Ready to Deploy!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: vercel login" -ForegroundColor White
Write-Host "2. Run: vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "Or run this command to deploy directly:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""

# Ask if user wants to deploy now
$deploy = Read-Host "Do you want to deploy to Vercel now? (y/n)"

if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check if already logged in
    Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
    $whoami = vercel whoami 2>&1
    
    if ($whoami -match "Error") {
        Write-Host "Please login to Vercel:" -ForegroundColor Yellow
        vercel login
    } else {
        Write-Host "✅ Already logged in as: $whoami" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🚀 Deploying to production..." -ForegroundColor Cyan
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=" * 60 -ForegroundColor Green
        Write-Host "🎉 Deployment Successful!" -ForegroundColor Green
        Write-Host "=" * 60 -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Test your verification page at: https://your-app.vercel.app/verify/CERT-2024-001" -ForegroundColor White
        Write-Host "2. Issue a real certificate via Admin Dashboard" -ForegroundColor White
        Write-Host "3. Test with the real certificate ID" -ForegroundColor White
        Write-Host "4. QR codes will automatically use the deployed URL!" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Deployment skipped. Run 'vercel --prod' when ready." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ Script completed!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
