import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";
import cp from "child_process";

// clone the reboot 01edu repo into the public folder
function cloneRebootRepo() {
  const DATA = {
    current_file_location: import.meta.url,
    current_dir: new URL(".", import.meta.url).pathname,
    public_dir: `${new URL(".", import.meta.url).pathname}public`,
    reboot_repo_dir: `${new URL(".", import.meta.url).pathname}public/01edu`,
  };
  // get os platform
  const os_platform = process.platform;
  if (os_platform === "win32") {
    DATA.current_dir = DATA.current_dir.slice(1);
    DATA.public_dir = DATA.public_dir.slice(1);
    DATA.reboot_repo_dir = DATA.reboot_repo_dir.slice(1);
  }
  console.log("os_platform", os_platform);
  console.log("current_dir", DATA.current_dir);
  console.log("public_dir", DATA.public_dir);
  console.log("reboot_repo_dir", DATA.reboot_repo_dir);
  // check if the reboot repo already exists
  if (fs.existsSync(DATA.reboot_repo_dir)) {
    console.log("reboot repo already exists, skipping clone");
    return;
  }
  console.log("cloning reboot repo into public folder");
  const a1 = cp.execSync("echo a1");
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
