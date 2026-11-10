import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { fileURLToPath, URL } from 'node:url';

// GitHub Pages 는 https://<계정>.github.io/<저장소명>/ 경로에서 서비스되므로
// 프로덕션 빌드에서만 저장소명을 base 로 사용한다. (dev 서버는 '/' 유지)
const REPO_BASE = '/taeri-publishing-library/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
}));
