# List of EIPs to keep for dev (one from each category + examples)
$keepFiles = @(
    "eip-1.md",      # Core
    "eip-20.md",     # ERC (token standard)
    "eip-721.md",    # ERC (NFT standard)
    "eip-1193.md",   # Interface
    "eip-627.md",    # Networking  
    "eip-1.md",      # Meta (yes, eip-1 is multi-category)
    "eip-2228.md"    # Informational
)

function Move-ToArchive {
    Write-Host "Moving EIPs to archive (keeping dev set)..." -ForegroundColor Yellow
    
    # Create archive if doesn't exist
    if (!(Test-Path "EIPS-archive")) {
        New-Item -ItemType Directory -Path "EIPS-archive" -Force
    }
    
    # Move all .md files EXCEPT the ones we want to keep
    Get-ChildItem "EIPS\*.md" | Where-Object {
        $keepFiles -notcontains $_.Name
    } | ForEach-Object {
        Move-Item $_.FullName "EIPS-archive\" -Force
    }
    
    $remaining = (Get-ChildItem "EIPS\*.md").Count
    Write-Host "Done! $remaining files left for fast builds" -ForegroundColor Green
}

function Restore-FromArchive {
    Write-Host "Restoring all EIPs from archive..." -ForegroundColor Yellow
    
    if (Test-Path "EIPS-archive\*.md") {
        Move-Item "EIPS-archive\*.md" "EIPS\" -Force
        $total = (Get-ChildItem "EIPS\*.md").Count
        Write-Host "Done! $total files restored" -ForegroundColor Green
    } else {
        Write-Host "No files in archive to restore" -ForegroundColor Red
    }
}

# Check which command to run
if ($args[0] -eq "archive") {
    Move-ToArchive
} elseif ($args[0] -eq "restore") {
    Restore-FromArchive
} else {
    Write-Host "Usage: .\dev-scripts.ps1 [archive|restore]" -ForegroundColor Red
}