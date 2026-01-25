# Configure Azure App Service Settings
# This script configures the required environment variables for the Azure App Service

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName,
    
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,
    
    [Parameter(Mandatory=$true)]
    [string]$CosmosEndpoint,
    
    [Parameter(Mandatory=$true)]
    [string]$CosmosKey,
    
    [Parameter(Mandatory=$true)]
    [string]$DatabaseId,
    
    [Parameter(Mandatory=$true)]
    [string]$ContainerId
)

Write-Host "Configuring Azure App Service settings for $AppName..."

# Set the application settings
az webapp config appsettings set --name $AppName --resource-group $ResourceGroup --settings `
    "COSMOS_DB_ENDPOINT=$CosmosEndpoint" `
    "COSMOS_DB_KEY=$CosmosKey" `
    "COSMOS_DB_DATABASE_ID=$DatabaseId" `
    "COSMOS_DB_CONTAINER_ID=$ContainerId" `
    "NODE_ENV=production" `
    "PORT=8080" `
    "WEBSITE_NODE_DEFAULT_VERSION=~20"

if ($LASTEXITCODE -eq 0) {
    Write-Host "? App Service settings configured successfully!"
} else {
    Write-Host "? Failed to configure App Service settings"
    exit 1
}