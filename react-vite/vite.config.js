// import { defineConfig } from "vite";
// import eslintPlugin from "vite-plugin-eslint";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig((mode) => ({
//   plugins: [
//     react(),
//     eslintPlugin({
//       lintOnStart: true,
//       failOnError: mode === "production",
//     }),
//   ],
//   server: {
//     open: true,
//     proxy: {
//       "/api": "http://127.0.0.1:8000",
//     },
//   },
// }));


import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig((mode) => ({
  plugins: [
    react(),
    eslintPlugin({
      lintOnStart: true,
      failOnError: mode === "production",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkSizeWarningLimit: 600
      }
    }
  },
  server: {
    open: true,
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
}));
