param(
    [switch]$Dev = $false
)

try {
    
    if (!(Test-Path -Path ".\server\node_modules")) {
        Write-Host "[INFO]: Looks like the first time running this project you'll need to install node_modules - installing now..." -ForegroundColor Cyan
        & .\Install.ps1 -Verbose
    }
    
    Push-Location ".\server"
    if ($Dev) {
        npm run dev
    }
    else {
        node index.mjs 
    }
}
finally {
    <#Do this after the try block regardless of whether an exception occurred or not#>
    Pop-Location
}
