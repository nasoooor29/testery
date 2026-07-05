import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";

function assertPublicRepoExists() {
  const repoDir = new URL("./public/01edu/.git", import.meta.url);

  if (!fs.existsSync(repoDir)) {
    throw new Error(
      "Missing 01-edu public repo at apps/web/public/01edu. Run `pnpm repo:clone` from the project root, then start the app again.",
    );
  }
}

assertPublicRepoExists();

export default defineConfig({
  server: {
    port: 3001,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
