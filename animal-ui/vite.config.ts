import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    host: true,
    port: 4173,
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
    //https: true,
  },
  plugins: [react()],
});
