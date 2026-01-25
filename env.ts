export const ENV = {
  CLOUD_SYNC_ENABLED: true, // Set to true to enable Cosmos DB by default
  COSMOS: {
    endpoint: process.env.COSMOS_DB_ENDPOINT || 'https://employee-db.documents.azure.com/',
    key: process.env.COSMOS_DB_KEY || '',
    databaseId: process.env.COSMOS_DB_DATABASE_ID || 'ltshrm',
    containerId: process.env.COSMOS_DB_CONTAINER_ID || 'Registry'
  }
};
