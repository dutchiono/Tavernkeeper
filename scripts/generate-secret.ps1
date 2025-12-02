# Generate a secure random secret for NEXTAUTH_SECRET
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$secret = [Convert]::ToBase64String($bytes)
Write-Host "NEXTAUTH_SECRET=$secret"
Write-Host ""
Write-Host "Copy the value above and add it to Render environment variables"
