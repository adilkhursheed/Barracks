/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COSMOS_DB_ENDPOINT?: string;
  readonly VITE_COSMOS_DB_KEY?: string;
  readonly VITE_COSMOS_DB_DATABASE_ID?: string;
  readonly VITE_COSMOS_DB_CONTAINER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
