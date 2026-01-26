export const ENV = {
  CLOUD_SYNC_ENABLED: true, // Set to true to enable Cosmos DB by default
  COSMOS: {
    endpoint: import.meta.env.VITE_COSMOS_DB_ENDPOINT,
    key: import.meta.env.VITE_COSMOS_DB_KEY,
    databaseId: import.meta.env.VITE_COSMOS_DB_DATABASE_ID,
    containerId: import.meta.env.VITE_COSMOS_DB_CONTAINER_ID
  }
};

// Diagnostic logging (safe - won't expose full key)
console.log('🔍 Cosmos DB Environment Check:');
console.log('  Endpoint:', ENV.COSMOS.endpoint);
console.log('  Key Present:', !!ENV.COSMOS.key, `(${ENV.COSMOS.key?.length || 0} chars)`);
console.log('  Database:', ENV.COSMOS.databaseId);
console.log('  Container:', ENV.COSMOS.containerId);
