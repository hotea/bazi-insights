import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Tailwind CSS v4 Vite 插件
    tailwindcss(),
  ],
  // GitHub Pages 部署路径
  base: '/bazi-insights/',
  test: {
    // 使用 jsdom 模拟浏览器环境
    environment: 'jsdom',
    // 全局引入测试工具
    globals: true,
    // 测试文件匹配模式
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
