
import { ENV } from '../env';

export interface CosmosConfig {
  endpoint: string;
  key: string;
  databaseId: string;
  containerId: string;
}

const CONFIG_KEY = 'barracks_cosmos_config';
const CLOUD_MODE_KEY = 'barracks_cloud_mode_enabled';
const LOCAL_STORAGE_KEY = 'barracks_v7_final_stable_v3';

export class PersistenceService {
  private client: any = null;
  private config: CosmosConfig | null = null;
  private isInitializing = false;
  private cloudModeEnabled = false;
  public lastError: string | null = null;

  constructor() {
    this.loadConfigSync();
  }

  private loadConfigSync() {
    try {
      // If ENV.CLOUD_SYNC_ENABLED is true, we force cloud mode and ignore any local storage settings
      if (ENV.CLOUD_SYNC_ENABLED) {
        this.cloudModeEnabled = true;
        this.config = ENV.COSMOS;
        console.log("Cloud Persistence Engine: Forced Active (Local Storage Bypassed)");
      } else {
        const savedMode = localStorage.getItem(CLOUD_MODE_KEY);
        this.cloudModeEnabled = savedMode !== null ? savedMode === 'true' : false;

        const saved = localStorage.getItem(CONFIG_KEY);
        if (saved) {
          this.config = JSON.parse(saved);
        } else {
          this.config = ENV.COSMOS;
        }
      }

      if (this.cloudModeEnabled) {
        this.initClient();
      }
    } catch (e) {
      console.warn("Config initialization failed:", e);
      this.config = ENV.COSMOS;
    }
  }

  private async initClient() {
    if (!this.config || this.isInitializing || this.client) return;
    if (!this.config.endpoint || !this.config.key) return;

    this.isInitializing = true;
    try {
      const cosmosModule = await import('@azure/cosmos');
      const { CosmosClient, ConnectionMode } = cosmosModule;
      
      const cleanEndpoint = this.config.endpoint.trim().replace(/:443\/?$/, '').replace(/\/$/, '');

      this.client = new CosmosClient({
        endpoint: cleanEndpoint,
        key: this.config.key,
        connectionPolicy: {
          connectionMode: ConnectionMode.Gateway
        }
      });
      console.log("Cloud Persistence Engine: Initialized (Gateway Mode)");
    } catch (e) {
      console.error("Cloud Persistence Engine: Initialization Error", e);
      this.client = null;
    } finally {
      this.isInitializing = false;
    }
  }

  public setCloudMode(enabled: boolean) {
    // If forced by env, do not allow changing via setter
    if (ENV.CLOUD_SYNC_ENABLED) return;

    this.cloudModeEnabled = enabled;
    localStorage.setItem(CLOUD_MODE_KEY, String(enabled));
    if (enabled) {
      this.initClient();
    } else {
      this.client = null;
    }
  }

  public isCloudMode(): boolean {
    return this.cloudModeEnabled;
  }

  public async saveConfig(config: CosmosConfig) {
    // If forced by env, we don't save to local storage
    if (ENV.CLOUD_SYNC_ENABLED) return;

    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      this.config = config;
      this.client = null; 
      if (this.cloudModeEnabled) {
        await this.initClient();
      }
    } catch (e) {
      console.error("Persistence configuration save failed:", e);
    }
  }

  public getConfig(): CosmosConfig | null {
    return this.config;
  }

  public isCloudEnabled(): boolean {
    return this.cloudModeEnabled && !!this.client && !!this.config;
  }

  public async testConnection(): Promise<boolean> {
    this.lastError = null;
    if (!this.client) {
      await this.initClient();
    }
    if (!this.client || !this.config) {
      this.lastError = "Client initialization failed. Please check credentials.";
      return false;
    }

    try {
      const { database } = await this.client.databases.createIfNotExists({ id: this.config.databaseId });
      await database.containers.createIfNotExists({ id: this.config.containerId });
      return true;
    } catch (e: any) {
      console.error("Cosmos DB Test Connection Failed:", e);
      const errorMsg = e.message || "Unknown error";
      if (errorMsg.toLowerCase().includes('fetch') || errorMsg.toLowerCase().includes('network')) {
         this.lastError = `CORS Blocked: The browser cannot reach Cosmos DB. 
         ACTION REQUIRED: In Azure Portal, go to Cosmos DB -> Settings -> CORS. 
         Add "${window.location.origin}" to the Allowed Origins.`;
      } else {
         this.lastError = `Connection Error: ${errorMsg}`;
      }
      return false;
    }
  }

  public async loadAll(): Promise<any> {
    // If CLOUD_SYNC_ENABLED is true, we never use local storage fallbacks
    if (ENV.CLOUD_SYNC_ENABLED) {
      if (!this.client) {
        console.log("?? Client not initialized, initializing now...");
        await this.initClient();
      }
      
      if (this.client && this.config) {
        try {
          console.log("?? Querying Cosmos DB for registry_state...");
          const container = this.client.database(this.config.databaseId).container(this.config.containerId);
          const { resources } = await container.items.query("SELECT * from c WHERE c.id = 'registry_state'").fetchAll();
          
          console.log(`?? Query returned ${resources.length} document(s)`);
          
          const stateDoc = resources[0];
          
          if (stateDoc && stateDoc.data) {
            console.log("? Cloud Registry loaded successfully (Pure Cloud Mode)", {
              hasEmployees: !!stateDoc.data.employees,
              employeeCount: stateDoc.data.employees?.length || 0,
              hasAssets: !!stateDoc.data.assets,
              assetCount: stateDoc.data.assets?.length || 0,
              hasTeams: !!stateDoc.data.teams,
              teamCount: stateDoc.data.teams?.length || 0
            });
            return stateDoc.data;
          } else if (stateDoc) {
            console.warn("?? Document found but has no 'data' field:", stateDoc);
            return null;
          } else {
            console.warn("?? No registry_state document found in Cosmos DB");
            return null;
          }
        } catch (e) {
          console.error("? Cloud Registry unreachable in Pure Cloud Mode", e);
          return null; // Force empty/initial state rather than falling back
        }
      } else {
        console.error("? Client or config not available:", { client: !!this.client, config: !!this.config });
      }
      return null;
    }

    // Traditional behavior for local-first or hybrid mode
    let data = this.loadLocal();

    if (this.cloudModeEnabled) {
      if (!this.client) await this.initClient();
      
      if (this.client && this.config) {
        try {
          const container = this.client.database(this.config.databaseId).container(this.config.containerId);
          const { resources } = await container.items.query("SELECT * from c WHERE c.id = 'registry_state'").fetchAll();
          const stateDoc = resources[0];
          
          if (stateDoc && stateDoc.data) {
            console.log("Cloud Registry loaded successfully.");
            data = stateDoc.data;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          }
        } catch (e) {
          console.warn("Cloud Registry unreachable, using local instance.", e);
        }
      }
    }

    return data;
  }

  private loadLocal(): any {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return localData ? JSON.parse(localData) : null;
    } catch (e) {
      console.error("LocalStorage load failed:", e);
      return null;
    }
  }

  public async saveAll(data: any): Promise<void> {
    try {
      // Bypass local storage if cloud is forced
      if (ENV.CLOUD_SYNC_ENABLED) {
        if (!this.client) {
          console.log("?? Client not initialized for save, initializing now...");
          await this.initClient();
        }
        
        if (this.client && this.config) {
          try {
            console.log("?? Saving to Cosmos DB:", {
              employees: data.employees?.length || 0,
              assets: data.assets?.length || 0,
              teams: data.teams?.length || 0
            });
            
            const container = this.client.database(this.config.databaseId).container(this.config.containerId);
            const result = await container.items.upsert({
              id: 'registry_state',
              data: data,
              lastUpdated: new Date().toISOString()
            });
            
            console.log("? Saved to Cosmos DB successfully", {
              statusCode: result.statusCode,
              requestCharge: result.requestCharge
            });
          } catch (e: any) {
            console.error("? Cloud Save failed in Pure Cloud Mode:", e);
            console.error("Error details:", {
              message: e.message,
              code: e.code,
              statusCode: e.statusCode
            });
          }
        } else {
          console.error("? Cannot save - Client or config not available:", {
            client: !!this.client,
            config: !!this.config
          });
        }
        return;
      }

      // Traditional behavior
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

      if (this.cloudModeEnabled) {
        if (!this.client) await this.initClient();
        
        if (this.client && this.config) {
          try {
            const container = this.client.database(this.config.databaseId).container(this.config.containerId);
            await container.items.upsert({
              id: 'registry_state',
              data: data,
              lastUpdated: new Date().toISOString()
            });
          } catch (e) {
            console.error("Cloud Save failed:", e);
          }
        }
      }
    } catch (e) {
      console.error("Persistence save cycle failed:", e);
    }
  }
}

export const persistence = new PersistenceService();
