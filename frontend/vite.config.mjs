import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true, // 서버 실행 시 기본 브라우저에서 자동으로 열림
    port: 8000,
    host: '172.18.231.82',  
    strictPort: true, 
    cors: true
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  plugins: [vue()],
});
