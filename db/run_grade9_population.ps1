# Grade 9 Content Population - Run All Parts
# This script executes all 3 SQL files in order

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GRADE 9 VOCABULARY POPULATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available (PostgreSQL command line tool)
$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
if (-not $supabaseUrl) {
    Write-Host "ERROR: NEXT_PUBLIC_SUPABASE_URL not found in environment" -ForegroundColor Red
    Write-Host "Please set your Supabase URL first" -ForegroundColor Yellow
    exit 1
}

Write-Host "Supabase URL: $supabaseUrl" -ForegroundColor Green
Write-Host ""

Write-Host "You need to run these SQL files manually in Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://supabase.com/dashboard/project/[your-project]/sql" -ForegroundColor Cyan
Write-Host "2. Copy and paste each file in order:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   FILE 1: db\grade9_part1_modules_1-3.sql" -ForegroundColor White
Write-Host "   MODULE: 1 (Hobbies & Qualities)" -ForegroundColor Gray
Write-Host "   MODULE: 2 (Exercise & Sport)" -ForegroundColor Gray
Write-Host "   MODULE: 3 (Earth & our place on it)" -ForegroundColor Gray
Write-Host "   WORDS: ~160 words" -ForegroundColor Green
Write-Host ""
Write-Host "   FILE 2: db\grade9_part2_modules_4-6.sql" -ForegroundColor White
Write-Host "   MODULE: 4 (Charities & Conflict)" -ForegroundColor Gray
Write-Host "   MODULE: 5 (Traditions & Language)" -ForegroundColor Gray
Write-Host "   MODULE: 6 (Reading for Pleasure)" -ForegroundColor Gray
Write-Host "   WORDS: ~85 words" -ForegroundColor Green
Write-Host ""
Write-Host "   FILE 3: db\grade9_part3_modules_7-9.sql" -ForegroundColor White
Write-Host "   MODULE: 7 (Entertainment & Media)" -ForegroundColor Gray
Write-Host "   MODULE: 8 (Travel & Tourism)" -ForegroundColor Gray
Write-Host "   MODULE: 9 (Science & Technology)" -ForegroundColor Gray
Write-Host "   WORDS: ~90 words" -ForegroundColor Green
Write-Host ""
Write-Host "TOTAL: ~335 words across all 9 modules!" -ForegroundColor Magenta
Write-Host ""
Write-Host "3. Run each file and verify it completes successfully" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Open files in default editor
Write-Host ""
$openFiles = Read-Host "Open SQL files in editor? (y/n)"
if ($openFiles -eq 'y') {
    code "db\grade9_part1_modules_1-3.sql"
    code "db\grade9_part2_modules_4-6.sql"  
    code "db\grade9_part3_modules_7-9.sql"
    Write-Host "Files opened in VS Code!" -ForegroundColor Green
}
