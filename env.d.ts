/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_URL: string
  readonly VITE_SELF_ENV: 'dev' | 'testnet' | 'mainnet' | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
