import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { env } from "node:process";
import { readFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      sourcemap: false,
      outDir: path.resolve(__dirname, "wwwroot"),
    },
    server: {
      https: {
        cert: readFileSync(path.resolve(__dirname, "misc/localhost.crt")).toString(),
        key: readFileSync(path.resolve(__dirname, "misc/localhost.key")).toString(),
      },
      port: 443,
      proxy: {
        "/api": {
          target:
            mode === "serve" ? "https://192.168.0.11:9001" : "https://chesswood.online",
          ws: true,
          changeOrigin: true,
          secure: false,
        },
        "/shared": {
          target:
            mode === "serve" ? "https://192.168.0.11:9001" : "https://chesswood.online",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
