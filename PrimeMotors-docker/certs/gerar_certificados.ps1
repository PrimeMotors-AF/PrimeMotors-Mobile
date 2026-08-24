# Script para gerar certificados self-signed para Nginx

$certPath = "C:\Users\fernando.rosa.PREFEITURA\Desktop\docker_test\PrimeMotors2026\PrimeMotors-docker\certs"

# Cria o diretório se não existir
if (-not (Test-Path $certPath)) {
    New-Item -ItemType Directory -Force -Path $certPath | Out-Null
    Write-Host "Diretório criado: $certPath" -ForegroundColor Green
}

# Gera o certificado auto-assinado
Write-Host "Gerando certificado self-signed..." -ForegroundColor Yellow

$cert = New-SelfSignedCertificate `
    -Subject "CN=PrimeMotors" `
    -DnsName "PrimeMotors", "localhost" `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -NotAfter (Get-Date).AddYears(1) `
    -KeyExportPolicy Exportable `
    -KeyUsage DigitalSignature, KeyEncipherment

Write-Host "Certificado criado com thumbprint: $($cert.Thumbprint)" -ForegroundColor Green

# Define a senha para exportar
$password = ConvertTo-SecureString -String "Senha123!" -Force -AsPlainText

# Exporta como PFX
$pfxPath = "$certPath\PrimeMotors.pfx"
Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $password -Force | Out-Null
Write-Host "Arquivo PFX exportado: $pfxPath" -ForegroundColor Green

# Exporta apenas o certificado (CRT) em formato PEM para o Nginx
$crtPath = "$certPath\PrimeMotors.crt"
$certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$crtPem = "-----BEGIN CERTIFICATE-----`r`n" + [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks) + "`r`n-----END CERTIFICATE-----"
Set-Content -Path $crtPath -Value $crtPem -Encoding ASCII
Write-Host "Arquivo CRT exportado em PEM: $crtPath" -ForegroundColor Green

# Tenta extrair a chave privada usando OpenSSL se disponível
if (Get-Command openssl -ErrorAction SilentlyContinue) {
    Write-Host "Extraindo chave privada com OpenSSL..." -ForegroundColor Yellow
    $keyPath = "$certPath\PrimeMotors.key"
    
    # Cria um arquivo temporário com a senha
    $passwordFile = "$certPath\temp_password.txt"
    "Senha123!" | Out-File -FilePath $passwordFile -Encoding ASCII -Force
    
    # Extrai a chave privada
    openssl pkcs12 -in $pfxPath -nocerts -nodes -out $keyPath -passin file:$passwordFile
    
    # Remove arquivo de senha temporário
    Remove-Item $passwordFile -Force
    
    Write-Host "Arquivo KEY exportado: $keyPath" -ForegroundColor Green
} else {
    Write-Host "OpenSSL não encontrado. Você pode extrair a chave privada manualmente." -ForegroundColor Yellow
    Write-Host "Instruções para extrair com OpenSSL:" -ForegroundColor Cyan
    Write-Host "  openssl pkcs12 -in $pfxPath -nocerts -nodes -out $certPath\PrimeMotors.key" -ForegroundColor Cyan
}

Write-Host "`nArquivos gerados em: $certPath" -ForegroundColor Green
Write-Host "Para usar em Docker, certifique-se que os arquivos .crt e .key existem." -ForegroundColor Green
