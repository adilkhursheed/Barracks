# Azure Deployment Guide for Barracks Management App

## Overview
This guide covers deploying the Barracks Management application to Azure App Service with Cosmos DB integration.

## Prerequisites
- Azure account with active subscription
- GitHub repository with the application code
- Node.js application with React frontend and Express backend

## Azure Resources Setup

### 1. Create Azure App Service

1. **Create Resource Group** (if not exists):
   ```bash
   az group create --name barracks-rg --location "East US"
   ```

2. **Create App Service Plan**:
   ```bash
   az appservice plan create \
     --name barracks-plan \
     --resource-group barracks-rg \
     --sku B1 \
     --is-linux
   ```

3. **Create Web App**:
   ```bash
   az webapp create \
     --resource-group barracks-rg \
     --plan barracks-plan \
     --name barracks-management \
     --runtime "NODE|20-lts"
   ```

### 2. Create Cosmos DB Account

1. **Create Cosmos DB Account**:
   ```bash
   az cosmosdb create \
     --name barracks-cosmosdb \
     --resource-group barracks-rg \
     --kind GlobalDocumentDB \
     --locations regionName="East US" failoverPriority=0 isZoneRedundant=False
   ```

2. **Create Database**:
   ```bash
   az cosmosdb sql database create \
     --account-name barracks-cosmosdb \
     --resource-group barracks-rg \
     --name ltshrm
   ```

3. **Create Container**:
   ```bash
   az cosmosdb sql container create \
     --account-name barracks-cosmosdb \
     --database-name ltshrm \
     --resource-group barracks-rg \
     --name Registry \
     --partition-key-path "/id"
   ```

## Configuration

### 1. Get Azure Credentials

1. **Download Publish Profile**:
   - Go to Azure Portal > App Services > barracks-management
   - Click "Get publish profile" and download the file
   - Add the content to GitHub Secrets as `AZURE_WEBAPP_PUBLISH_PROFILE`

2. **Get Cosmos DB Connection Details**:
   ```bash
   # Get endpoint
   az cosmosdb show --name barracks-cosmosdb --resource-group barracks-rg --query documentEndpoint -o tsv
   
   # Get primary key
   az cosmosdb keys list --name barracks-cosmosdb --resource-group barracks-rg --query primaryMasterKey -o tsv
   ```

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `AZURE_WEBAPP_PUBLISH_PROFILE`: Content of the publish profile file
- `COSMOS_DB_ENDPOINT`: Cosmos DB endpoint URL
- `COSMOS_DB_KEY`: Cosmos DB primary key
- `COSMOS_DB_DATABASE_ID`: Database name (default: ltshrm)
- `COSMOS_DB_CONTAINER_ID`: Container name (default: Registry)

### 3. App Service Configuration

Set environment variables in Azure App Service:

1. Go to Azure Portal > App Services > barracks-management
2. Navigate to "Configuration" > "Application settings"
3. Add the following settings:
   - `COSMOS_DB_ENDPOINT`: Your Cosmos DB endpoint
   - `COSMOS_DB_KEY`: Your Cosmos DB key
   - `COSMOS_DB_DATABASE_ID`: ltshrm
   - `COSMOS_DB_CONTAINER_ID`: Registry
   - `NODE_ENV`: production
   - `PORT`: 8080

## Deployment

### Automatic Deployment
The application automatically deploys when you push to the `main` branch through GitHub Actions.

### Manual Deployment
You can also trigger deployment manually:
1. Go to GitHub repository > Actions
2. Select "Deploy to Azure App Service" workflow
3. Click "Run workflow"

## Monitoring and Troubleshooting

### View Logs
```bash
az webapp log tail --name barracks-management --resource-group barracks-rg
```

### Common Issues

1. **Build Failures**: Check if all dependencies are in package.json
2. **Runtime Errors**: Verify environment variables are set correctly
3. **Database Connection**: Ensure Cosmos DB firewall allows Azure services

### Health Checks
- Application URL: `https://barracks-management.azurewebsites.net`
- Health endpoint: Check if the app loads properly

## Cost Optimization

- Use B1 plan for development, scale up for production
- Consider using consumption plan for Cosmos DB if usage is low
- Set up auto-scaling based on demand

## Security Considerations

- Enable HTTPS only in App Service
- Use managed identity for Cosmos DB access (recommended)
- Regularly rotate Cosmos DB keys
- Set up application insights for monitoring

## Backup and Recovery

- App Service: Automatic backups available in higher tiers
- Cosmos DB: Point-in-time restore available with continuous backup
- Source code: GitHub repository serves as backup