interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  // thêm các biến khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
