# Nome do arquivo .ino
$fileName = "blockuino_sketch_2025-08-28T09-42-49.ino"

# Caminho atual do arquivo
$currentPath = "$PSScriptRoot\$fileName"

# Nome da pasta que será criada
$folderName = $fileName -replace ".ino", ""

# Caminho da nova pasta
$folderPath = "$PSScriptRoot\$folderName"

# Caminho do arquivo dentro da nova pasta
$newFilePath = "$folderPath\$fileName"

# Verifica se a pasta já existe
if (!(Test-Path -Path $folderPath)) {
    # Cria a pasta
    New-Item -ItemType Directory -Path $folderPath
}

# Move o arquivo para a nova pasta
Move-Item -Path $currentPath -Destination $newFilePath

Write-Host "Arquivo movido para: $newFilePath"
