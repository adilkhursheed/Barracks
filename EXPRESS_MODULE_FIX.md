# Node.js Module Error Fix - EXPRESS MODULE NOT FOUND

## Problem ❌
Your app is failing with this error:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from /home/site/wwwroot/server.js
```

## Root Cause 🔍
The deployment workflow is not including the `node_modules` folder (production dependencies) in the deployed package. Azure App Service needs these dependencies to run your Express server.

## Solution Options 🛠️

### Option 1: Use Azure's Built-in Package Installation (Recommended) ⭐

1. **Add `.deployment` configuration** (✅ Already created):
   ```
   [config]
   SCM_DO_BUILD_DURING_DEPLOYMENT=true
   ```

2. **Use the optimal workflow** - Replace your current workflow with:
   - **File**: `.github/workflows/azure-deploy-optimal.yml`
   - **Key change**: Includes `package-lock.json` so Azure can install dependencies automatically

3. **Update your App Service settings** in Azure Portal:
   - Go to **Configuration** > **Application settings**
   - Add: `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true`
   - Add: `ENABLE_ORYX_BUILD` = `true` 

### Option 2: Include node_modules in Deployment Package

Use the workflow: `.github/workflows/azure-deploy-node-modules-fix.yml`
- **Pro**: Guaranteed to include all dependencies
- **Con**: Larger deployment package, slower uploads

## Quick Fix Steps 🚀

### Immediate Action:
1. **Replace your workflow file** with `.github/workflows/azure-deploy-optimal.yml`
2. **Commit and push** the `.deployment` file to your repository
3. **Add Azure App Settings**:
   ```
   SCM_DO_BUILD_DURING_DEPLOYMENT = true
   ENABLE_ORYX_BUILD = true
   ```
4. **Redeploy** by pushing to main branch

### Verification:
1. **Monitor deployment logs** in Azure Portal > Deployment Center
2. **Check app logs** - the Express error should be gone
3. **Test your app** at https://lts-employeeportal-int.azurewebsites.net

## Azure App Service Configuration

Add these settings in Azure Portal > Configuration > Application settings:

| Name | Value |
|------|-------|
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `ENABLE_ORYX_BUILD` | `true` |
| `PRE_BUILD_COMMAND` | `npm ci --production` |

## Files Created ✅
- ✅ `.deployment` - Tells Azure to build during deployment
- ✅ `.github/workflows/azure-deploy-optimal.yml` - Fixed workflow (recommended)
- ✅ `.github/workflows/azure-deploy-node-modules-fix.yml` - Alternative with node_modules

## Expected Result 🎯
After applying this fix:
- ✅ Express module will be found
- ✅ Server will start successfully  
- ✅ App will be accessible via Azure App Service URL
- ✅ All Cosmos DB connections will work

The key insight: Azure App Service can install Node.js dependencies automatically if properly configured! 🚀