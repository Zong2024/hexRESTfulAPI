import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 關鍵：這裡要填入你的 Repo 名稱，前後都要加上斜線
  base: "/hexRESTfulAPI/",
})
