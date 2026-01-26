#!/bin/bash

# Azure Deployment Setup Script for Barracks Management App
# Run this script to set up Azure resources

set -e

echo "🚀 Setting up Azure resources for Barracks Management App..."

# Variables (modify these as needed)
RESOURCE_GROUP="lts-employeeportal-int_group"
LOCATION="eastus"
APP_SERVICE_PLAN="lts-portal-plan"
WEB_APP_NAME="lts-employeeportal-int"
COSMOSDB_ACCOUNT="employee-db"
DATABASE_NAME="ltshrm"
CONTAINER_NAME="Registry"

# Create Resource Group
#echo "📁 Creating resource group..."
#az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan
# echo "⚙️ Creating App Service Plan..."
# az appservice plan create \
#   --name $APP_SERVICE_PLAN \
#   --resource-group $RESOURCE_GROUP \
#   --sku B1 \
#   --is-linux

# Create Web App
# echo "🌐 Creating Web App..."
# az webapp create \
#   --resource-group $RESOURCE_GROUP \
#   --plan $APP_SERVICE_PLAN \
#   --name $WEB_APP_NAME \
#   --runtime "NODE|20-lts"

# Get connection details
echo "🔑 Getting connection details..."
COSMOS_ENDPOINT=$(az cosmosdb show --name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --query documentEndpoint -o tsv)
COSMOS_KEY=$(az cosmosdb keys list --name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --query primaryMasterKey -o tsv)

echo ""
echo "✅ Setup complete! Add these values to your GitHub Secrets:"
echo "COSMOS_DB_ENDPOINT: $COSMOS_ENDPOINT"
echo "COSMOS_DB_KEY: $COSMOS_KEY"
echo "COSMOS_DB_DATABASE_ID: $DATABASE_NAME"
echo "COSMOS_DB_CONTAINER_ID: $CONTAINER_NAME"
echo ""
echo "Web App URL: https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo "Next steps:"
echo "1. Download publish profile from Azure Portal"
echo "2. Add AZURE_WEBAPP_PUBLISH_PROFILE to GitHub Secrets"
echo "3. Add Cosmos DB values to GitHub Secrets"
echo "4. Push to main branch to trigger deployment"




# created app here is next
✅ Setup complete! Add these values to your GitHub Secrets:
COSMOS_DB_ENDPOINT: https://employee-db.documents.azure.com:443/

COSMOS_DB_DATABASE_ID: ltshrm
COSMOS_DB_CONTAINER_ID: Registry

Web App URL: https://lts-employeeportal-int.azurewebsites.net

Next steps:
1. Download publish profile from Azure Portal
2. Add AZURE_WEBAPP_PUBLISH_PROFILE to GitHub Secrets
3. Add Cosmos DB values to GitHub Secrets
4. Push to main branch to trigger deployment



# Get the publish profile using Azure CLI
az webapp deployment list-publishing-profiles \
  --name lts-employeeportal-int \
  --resource-group lts-employeeportal-int_group \
  --xml