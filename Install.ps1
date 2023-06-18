param(
    [switch]$Verbose = $false
)

try {
    Push-Location ".\server"
    
    if ($Verbose) {
        npm install --verbose
    }
    else {
        npm install
    }
}
finally {
    <#Do this after the try block regardless of whether an exception occurred or not#>
    Pop-Location
}

