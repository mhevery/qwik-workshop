import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { builderDevTools } from "@builder.io/dev-tools/vite";

export default defineConfig(() => {
  return {
    optimizeDeps: {
      include: ["@auth/core"]
    },
    plugins: [
      builderDevTools(), 
      qwikCity(), qwikVite()],
  };
});
