# Azure App Service Deployment Fix Guide

## Issue
The deployment fails at the "Configure App Settings" step with error:
```
Error: The process '/usr/bin/az' failed with exit code 1
```

This is caused by the `azure/appservice-settings@v1` GitHub Action which has known authentication issues with publish profiles.

## Solution Options

### Option 1: Remove Problematic Step (Recommended)
Use the simplified workflow file `azure-deploy-fixed.yml` which removes the problematic app settings step. Then configure settings manually.

1. **Replace your workflow file**:
   - Use `.github/workflows/azure-deploy-fixed.yml` instead of the current one
   - This removes the problematic `azure/appservice-settings@v1` step

2. **Configure settings manually using Azure CLI**:
   ```bash
   # Set environment variables first
   export COSMOS_DB_ENDPOINT="your-cosmos-endpoint"
   export COSMOS_DB_KEY="your-cosmos-key" 
   export COSMOS_DB_DATABASE_ID="ltshrm"
   export COSMOS_DB_CONTAINER_ID="Registry"
   
   # Run the configuration script
   chmod +x scripts/configure-azure-settings.sh
   ./scripts/configure-azure-settings.sh
   ```

### Option 2: Configure in Azure Portal
1. Go to **Azure Portal** > **App Services** > **lts-employeeportal-int**
2. Navigate to **Configuration** > **Application settings**
3. Add the following settings:
   - `COSMOS_DB_ENDPOINT`: Your Cosmos DB endpoint URL
   - `COSMOS_DB_KEY`: Your Cosmos DB primary key
   - `COSMOS_DB_DATABASE_ID`: ltshrm
   - `COSMOS_DB_CONTAINER_ID`: Registry
   - `NODE_ENV`: production
   - `PORT`: 8080
   - `WEBSITE_NODE_DEFAULT_VERSION`: ~20

### Option 3: Use Azure CLI in Workflow (Advanced)
Replace the problematic step with Azure CLI commands using Service Principal authentication (requires additional setup).

## Testing the Fix

1. **Push to main branch** to trigger deployment
2. **Monitor the workflow** - it should now complete without the app settings error
3. **Verify the app** is running at your Azure App Service URL
4. **Configure settings** using one of the methods above

## Verification

After configuring settings, verify your app is working:

1. **Check app status**: Visit your Azure App Service URL
2. **View logs**: 
   ```bash
   az webapp log tail --name lts-employeeportal-int --resource-group your-resource-group
   ```
3. **Test API endpoints**: Ensure Cosmos DB connectivity is working

## Notes

- The `azure/appservice-settings@v1` action is deprecated and has authentication issues
- Manual configuration is more reliable for app settings
- Consider using Azure Key Vault for sensitive configuration values in production