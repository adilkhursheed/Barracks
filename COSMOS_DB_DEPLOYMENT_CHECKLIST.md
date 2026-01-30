# Cosmos DB Environment Configuration Checklist

## ? Code Changes Complete

All necessary code changes have been made:

1. ? `env.ts` - Updated to use `import.meta.env.VITE_*` instead of `process.env.*`
2. ? `vite-env.d.ts` - Created TypeScript definitions for Vite environment variables
3. ? `.github/workflows/azure-deploy-optimal.yml` - Updated to inject environment variables during build
4. ? `.env.example` - Updated with correct `VITE_` prefix

---

## ?? Deployment Checklist

### 1. **Add GitHub Secrets** (Required for CI/CD)

Go to your GitHub repository: https://github.com/adilkhursheed/Barracks

Navigate to: **Settings** ? **Secrets and variables** ? **Actions** ? **New repository secret**

Add these two secrets:

| Secret Name | Value |
|-------------|-------|
| `COSMOS_DB_ENDPOINT` | `https://employee-db.documents.azure.com:443/` |
| `COSMOS_DB_KEY` | Get from Azure Portal ? Cosmos DB ? Keys ? Primary Key |

**Where to find the Cosmos DB Key:**
1. Go to Azure Portal: https://portal.azure.com
2. Navigate to your Cosmos DB account: `employee-db`
3. Click **Keys** in the left menu
4. Copy the **PRIMARY KEY** value

---

### 2. **Local Development Setup** (Optional - for testing before deployment)

Create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your actual Cosmos DB primary key:

```env
VITE_COSMOS_DB_ENDPOINT=https://employee-db.documents.azure.com:443/
VITE_COSMOS_DB_KEY=your-actual-primary-key-here
VITE_COSMOS_DB_DATABASE_ID=ltshrm
VITE_COSMOS_DB_CONTAINER_ID=Registry
```

**Test locally:**
```bash
npm run dev
```

Open browser console and verify you see:
```
?? Cosmos DB Environment Check:
  Endpoint: https://employee-db.documents.azure.com:443/
  Key Present: true (64 chars)
  Database: ltshrm
  Container: Registry
```

---

### 3. **Remove Old Azure App Service Settings** (Optional Cleanup)

Since we now inject values at **build time** instead of **runtime**, these Azure App Service settings are no longer needed:

1. Go to Azure Portal ? App Service: `lts-employeeportal-int`
2. Navigate to **Configuration** ? **Application settings**
3. You can **remove** these (they won't be used):
   - ~~COSMOS_DB_KEY~~
   - ~~COSMOS_DB_ENDPOINT~~

---

### 4. **Deploy to Azure**

#### Option A: Automatic Deployment (Push to `main` branch)

```bash
git add .
git commit -m "Fix: Configure Cosmos DB with Vite environment variables"
git push origin cosmos
```

Then merge to `main` branch to trigger deployment.

#### Option B: Manual Workflow Trigger

1. Go to GitHub: https://github.com/adilkhursheed/Barracks/actions
2. Select **Deploy to Azure App Service (Optimal)**
3. Click **Run workflow** ? Select `main` branch ? **Run workflow**

---

### 5. **Verify Deployment**

After deployment completes:

1. Open your app: https://lts-employeeportal-int.azurewebsites.net
2. Open browser **DevTools** ? **Console** tab
3. Look for diagnostic messages:

**Expected Output:**
```
?? Cosmos DB Environment Check:
  Endpoint: https://employee-db.documents.azure.com:443/
  Key Present: true (64 chars)
  Database: ltshrm
  Container: Registry

Cloud Persistence Engine: Forced Active (Local Storage Bypassed)
Cloud Persistence Engine: Initialized (Gateway Mode)
```

4. Test the application:
   - Go to **Settings** page
   - Click **Verify Connectivity** button
   - Should see "Connection Successful" message

---

## ?? Troubleshooting

### Issue: "Key Present: false (0 chars)"

**Cause:** GitHub secrets not configured or workflow didn't inject them during build.

**Fix:**
1. Verify GitHub secrets are added correctly
2. Re-run the deployment workflow
3. Check Actions logs to ensure build step has `env:` section

---

### Issue: "CORS Blocked"

**Cause:** Cosmos DB CORS settings don't include your app domain.

**Fix:**
1. Azure Portal ? Cosmos DB: `employee-db`
2. **Settings** ? **CORS**
3. Add allowed origin:
   ```
   https://lts-employeeportal-int.azurewebsites.net
   ```
4. Click **Save**

---

### Issue: "Client initialization failed"

**Cause:** Invalid Cosmos DB key or endpoint.

**Fix:**
1. Verify the Cosmos DB key in GitHub secrets matches the Primary Key in Azure Portal
2. Ensure endpoint format: `https://employee-db.documents.azure.com:443/`
3. Re-deploy after fixing secrets

---

## ?? Environment Variable Flow

```
???????????????????????????????????????????????????????????????
? 1. GitHub Secrets (Repository Settings)                     ?
?    - COSMOS_DB_ENDPOINT                                      ?
?    - COSMOS_DB_KEY                                           ?
???????????????????????????????????????????????????????????????
                     ?
                     ?
???????????????????????????????????????????????????????????????
? 2. GitHub Actions Workflow (Build Step)                     ?
?    env:                                                      ?
?      VITE_COSMOS_DB_ENDPOINT: ${{ secrets.COSMOS_DB_... }}  ?
?      VITE_COSMOS_DB_KEY: ${{ secrets.COSMOS_DB_KEY }}       ?
???????????????????????????????????????????????????????????????
                     ?
                     ?
???????????????????????????????????????????????????????????????
? 3. Vite Build Process                                       ?
?    - Reads VITE_* environment variables                     ?
?    - Injects into built JavaScript as import.meta.env       ?
???????????????????????????????????????????????????????????????
                     ?
                     ?
???????????????????????????????????????????????????????????????
? 4. Built JavaScript (dist/assets/index-*.js)                ?
?    - Contains hardcoded values (baked in at build time)     ?
???????????????????????????????????????????????????????????????
                     ?
                     ?
???????????????????????????????????????????????????????????????
? 5. Browser Runtime (env.ts)                                 ?
?    - import.meta.env.VITE_COSMOS_DB_KEY returns the value   ?
?    - Used to initialize Cosmos DB client                    ?
???????????????????????????????????????????????????????????????
```

---

## ?? Security Considerations

### Current Architecture

The Cosmos DB **primary key is embedded** in client-side JavaScript. Anyone can:
- Open browser DevTools
- View Network tab or inspect JavaScript files
- Extract the Cosmos DB key

### Immediate Mitigations

1. **Enable CORS restrictions** - Only allow your app domain
2. **Configure IP restrictions** - Limit access to known IPs
3. **Use read-only keys** - If your app only reads data

### Long-term Solutions

1. **Backend API Proxy**
   - Move Cosmos DB client to server-side (Node.js backend)
   - Frontend calls your API, not Cosmos DB directly
   - Keep keys server-side only

2. **Azure AD Authentication**
   - Use Managed Identity for Azure App Service
   - No keys in code at all

3. **Cosmos DB Resource Tokens**
   - Generate scoped, time-limited tokens
   - Restrict access per user/session

---

## ?? Next Steps

1. [ ] Add GitHub secrets (COSMOS_DB_ENDPOINT, COSMOS_DB_KEY)
2. [ ] Test locally with `.env` file (optional)
3. [ ] Deploy to Azure (push to main or trigger workflow)
4. [ ] Verify deployment (check console logs)
5. [ ] Test connectivity in Settings page
6. [ ] Plan security improvements (backend API proxy)

---

## ?? Support

If issues persist:
1. Check GitHub Actions logs: https://github.com/adilkhursheed/Barracks/actions
2. Check Azure App Service logs: Azure Portal ? App Service ? Log Stream
3. Check browser console for diagnostic messages
