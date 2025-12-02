# Remove .env files from ALL commits in history
$envFiles = @('.env', 'apps/web/.env', 'infra/.env')

# Get all commits
$allCommits = git log --all --format="%H" | ForEach-Object { $_.Trim() }

Write-Host "Found $($allCommits.Count) commits to process"

# Use git filter-branch with a script that removes the files
$script = @"
#!/bin/sh
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env apps/web/.env infra/.env' --prune-empty --tag-name-filter cat -- --all
"@

$script | Out-File -FilePath "filter-script.sh" -Encoding ASCII
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env apps/web/.env infra/.env" --prune-empty --tag-name-filter cat -- --all

# Clean up
git for-each-ref --format="delete %(refname)" refs/original/ | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Done! Secrets removed from history."
