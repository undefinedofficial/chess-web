/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VUE_APP_BACKEND_WEBSOCKET: string;
  readonly VITE_VUE_APP_BACKEND_SERVER: string;
  readonly VITE_VUE_APP_SMARTRECAPTCHA_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
