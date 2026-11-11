import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  build: {
    // 保持产物精简，App 端走原生 WebView 渲染
    chunkSizeWarningLimit: 1200
  }
})
