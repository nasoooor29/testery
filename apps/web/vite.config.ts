import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";
import process from "child_process";

// clone the reboot 01edu repo into the public folder
function cloneRebootRepo() {
  const current_file_location = import.meta.url;
  const current_dir = new URL(".", current_file_location).pathname;
  const public_dir = `${current_dir}public`;
  const reboot_repo_dir = `${public_dir}01edu`;
  console.log("current_dir", current_dir);
  console.log("public_dir", public_dir);
  console.log("reboot_repo_dir", reboot_repo_dir);
  // check if the reboot repo already exists
  if (fs.existsSync(reboot_repo_dir)) {
    console.log("reboot repo already exists, skipping clone");
    return;
  }
  console.log("cloning reboot repo into public folder");
  const a1 = process.execSync("echo a1");
  // print the output of the command
  console.log(a1.toString());
}
cloneRebootRepo();

export default defineConfig({
  server: {
    port: 3001,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
