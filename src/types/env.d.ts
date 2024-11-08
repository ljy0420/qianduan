interface ImportMetaEnv {
  /**
   * 应用标题
   */
  VITE_TITLE: string;
  /**
   * 应用端口
   */
  VITE_PORT: number;
  /**
   * API基础路径(反向代理)
   */
  VITE_BASE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
