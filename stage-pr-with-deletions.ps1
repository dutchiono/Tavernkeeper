# Stage PR with Deletions
# This script stages a PR including DELETED files
# It will delete files locally that are deleted in the PR

param(
    [Parameter(Mandatory=$true)]
    [int]$PRNumber
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STAGE PR WITH DELETIONS" -ForegroundColor Cyan
Write-Host "PR #$PRNumber" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify we're on main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "WARNING: Not on main branch! Current: $currentBranch" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (yes/no)"
    if ($continue -ne "yes") {
        exit 1
    }
}

# Step 2: Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "WARNING: You have uncommitted changes!" -ForegroundColor Yellow
    Write-Host "Current changes:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $continue = Read-Host "Continue anyway? (yes/no)"
    if ($continue -ne "yes") {
        exit 1
    }
}

# Step 3: Create backup
Write-Host ""
Write-Host "Creating backup branch..." -ForegroundColor Yellow
$backupName = "backup-before-pr-$PRNumber-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backupName
Write-Host "✓ Backup created: $backupName" -ForegroundColor Green

# Step 4: Get PR diff to identify all changes
Write-Host ""
Write-Host "Analyzing PR #$PRNumber..." -ForegroundColor Yellow

# Get all file changes from PR
$prDiff = gh pr diff $PRNumber --name-status

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to get PR diff. Is PR #$PRNumber valid?" -ForegroundColor Red
    exit 1
}

# Parse the diff output
$addedFiles = @()
$modifiedFiles = @()
$deletedFiles = @()

$prDiff | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^([AMD])\s+(.+)$') {
        $status = $matches[1]
        $file = $matches[2]

        switch ($status) {
            'A' { $addedFiles += $file }
            'M' { $modifiedFiles += $file }
            'D' { $deletedFiles += $file }
        }
    }
}

# Step 5: Display summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PR #$PRNumber SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Files to ADD: $($addedFiles.Count)" -ForegroundColor Green
Write-Host "Files to MODIFY: $($modifiedFiles.Count)" -ForegroundColor Yellow
Write-Host "Files to DELETE: $($deletedFiles.Count)" -ForegroundColor Red
Write-Host ""

if ($deletedFiles.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "FILES TO BE DELETED:" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    $deletedFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host ""
}

if ($addedFiles.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "FILES TO BE ADDED:" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    $addedFiles | ForEach-Object { Write-Host "  + $_" -ForegroundColor Green }
    Write-Host ""
}

if ($modifiedFiles.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "FILES TO BE MODIFIED:" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    $modifiedFiles | ForEach-Object { Write-Host "  ~ $_" -ForegroundColor Yellow }
    Write-Host ""
}

# Step 6: CONFIRMATION
Write-Host "========================================" -ForegroundColor Red
Write-Host "CONFIRMATION REQUIRED" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "This script will:" -ForegroundColor White
Write-Host "  ✓ Checkout PR #$PRNumber" -ForegroundColor Green
Write-Host "  ✓ DELETE $($deletedFiles.Count) files locally" -ForegroundColor Red
Write-Host "  ✓ ADD $($addedFiles.Count) new files" -ForegroundColor Green
Write-Host "  ✓ MODIFY $($modifiedFiles.Count) existing files" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  WARNING: Files will be DELETED from your working directory!" -ForegroundColor Red
Write-Host ""
$confirmation = Read-Host "Type 'YES DELETE' to proceed, or anything else to cancel"

if ($confirmation -ne "YES DELETE") {
    Write-Host ""
    Write-Host "Cancelled. No changes made." -ForegroundColor Yellow
    exit 0
}

# Step 7: Checkout PR branch
Write-Host ""
Write-Host "Checking out PR #$PRNumber..." -ForegroundColor Yellow
$tempBranch = "pr-$PRNumber-temp-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
gh pr checkout $PRNumber --branch $tempBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to checkout PR branch" -ForegroundColor Red
    exit 1
}

Write-Host "✓ PR branch checked out to: $tempBranch" -ForegroundColor Green

# Step 8: Switch back to main and apply changes
Write-Host ""
Write-Host "Switching back to main..." -ForegroundColor Yellow
git checkout main

# Step 9: Delete files that are deleted in PR
if ($deletedFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Deleting files..." -ForegroundColor Yellow
    $deletedCount = 0
    $notFoundCount = 0

    foreach ($file in $deletedFiles) {
        if (Test-Path $file) {
            Remove-Item -Path $file -Force
            Write-Host "  ✓ Deleted: $file" -ForegroundColor Red
            $deletedCount++
        } else {
            Write-Host "  ⊘ Not found (already deleted?): $file" -ForegroundColor Gray
            $notFoundCount++
        }
    }

    Write-Host ""
    Write-Host "Deleted: $deletedCount files" -ForegroundColor Red
    if ($notFoundCount -gt 0) {
        Write-Host "Not found: $notFoundCount files" -ForegroundColor Gray
    }
}

# Step 10: Copy new and modified files from PR branch
Write-Host ""
Write-Host "Copying files from PR branch..." -ForegroundColor Yellow

$allFilesToCopy = $addedFiles + $modifiedFiles
$copiedCount = 0
$errorCount = 0

foreach ($file in $allFilesToCopy) {
    try {
        # Create directory structure if needed
        $fileDir = Split-Path $file -Parent
        if ($fileDir -and -not (Test-Path $fileDir)) {
            New-Item -ItemType Directory -Path $fileDir -Force | Out-Null
        }

        # Copy file from PR branch
        $content = git show "$tempBranch`:$file" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Set-Content -Path $file -Value $content
            Write-Host "  ✓ Copied: $file" -ForegroundColor Green
            $copiedCount++
        } else {
            Write-Host "  ✗ Error copying: $file" -ForegroundColor Red
            $errorCount++
        }
    } catch {
        Write-Host "  ✗ Error: $file - $_" -ForegroundColor Red
        $errorCount++
    }
}

# Step 11: Cleanup temp branch
Write-Host ""
Write-Host "Cleaning up temporary branch..." -ForegroundColor Yellow
git branch -D $tempBranch

# Step 12: Stage all changes
Write-Host ""
Write-Host "Staging all changes..." -ForegroundColor Yellow

# Stage deletions
if ($deletedFiles.Count -gt 0) {
    foreach ($file in $deletedFiles) {
        if (-not (Test-Path $file)) {
            git rm $file 2>&1 | Out-Null
        }
    }
}

# Stage additions and modifications
if ($allFilesToCopy.Count -gt 0) {
    foreach ($file in $allFilesToCopy) {
        if (Test-Path $file) {
            git add $file 2>&1 | Out-Null
        }
    }
}

# Step 13: Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "STAGING COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files deleted: $deletedCount" -ForegroundColor Red
Write-Host "  Files copied: $copiedCount" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "  Errors: $errorCount" -ForegroundColor Red
}
Write-Host ""
Write-Host "Current status:" -ForegroundColor Cyan
git status --short
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review changes: git status" -ForegroundColor White
Write-Host "  2. Review deletions: git diff --cached" -ForegroundColor White
Write-Host "  3. If satisfied, commit: git commit -m 'Stage PR #$PRNumber with deletions'" -ForegroundColor White
Write-Host "  4. If not satisfied, restore: git restore --staged . ; git restore ." -ForegroundColor White
Write-Host "  5. Or reset completely: git reset --hard $backupName" -ForegroundColor White
Write-Host ""
Write-Host "Backup branch: $backupName" -ForegroundColor Green
Write-Host ""

