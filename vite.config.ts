import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import Icons from "unplugin-icons/vite";
// import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
// import Inspect from "vite-plugin-inspect";
// import * as path from "path";

// const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    ElementPlus({
      // options
    }),
  ],
});
