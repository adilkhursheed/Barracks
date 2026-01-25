#!/bin/bash

# Configure Azure App Service Environment Variables
# Run this script after deployment to set up the required environment variables

APP_NAME="lts-employeeportal"
RESOURCE_GROUP="lts-employeeportal_group"  # Update with your actual resource group name

echo "?? Configuring Azure App Service settings for $APP_NAME..."

# Check if user is logged in to Azure CLI
if ! az account show > /dev/null 2>&1; then
    echo "? Please log in to Azure CLI first: az login"
    exit 1
fi

# Set the application settings
az webapp config appsettings set \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings \
        "COSMOS_DB_ENDPOINT=${COSMOS_DB_ENDPOINT}" \
        "COSMOS_DB_KEY=${COSMOS_DB_KEY}" \
        "COSMOS_DB_DATABASE_ID=${COSMOS_DB_DATABASE_ID}" \
        "COSMOS_DB_CONTAINER_ID=${COSMOS_DB_CONTAINER_ID}" \
        "NODE_ENV=production" \
        "PORT=8080" \
        "WEBSITE_NODE_DEFAULT_VERSION=~20"

if [ $? -eq 0 ]; then
    echo "? App Service settings configured successfully!"
    echo ""
    echo "?? Settings configured:"
    echo "   - COSMOS_DB_ENDPOINT: [HIDDEN]"
    echo "   - COSMOS_DB_KEY: [HIDDEN]"
    echo "   - COSMOS_DB_DATABASE_ID: ${COSMOS_DB_DATABASE_ID}"
    echo "   - COSMOS_DB_CONTAINER_ID: ${COSMOS_DB_CONTAINER_ID}"
    echo "   - NODE_ENV: production"
    echo "   - PORT: 8080"
    echo "   - WEBSITE_NODE_DEFAULT_VERSION: ~20"
    echo ""
    echo "?? Your app should now be fully configured!"
else
    echo "? Failed to configure App Service settings"
    echo "Please check:"
    echo "1. You have the correct permissions"
    echo "2. The app name and resource group are correct"
    echo "3. The environment variables are set"
    exit 1
fi