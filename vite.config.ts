import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'


export default defineConfig({
  // depending on your application, base can also be "/"
  base: "/",
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    })
  ],
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      assets: "/src/assets"
    },
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3003,
  },
  define: {
    'process.env': {}
  },
  build:{
    outDir: "build",
    assetsDir: 'assets',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
