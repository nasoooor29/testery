import { z } from "zod";
import { publicProcedure } from "..";
import { env } from "@testery/env/server";
import { dockerRun } from "../utils/docker";

export const testerRouter = {
  rust: publicProcedure
    .input(z.object({ name: z.string() }))
    .handler(async function ({ input, signal }) {
      const repoPath = `${env.REPOS_DIR}/piscine-rust`;

      const args = [
        "run",
        "--rm",
        "-e",
        `EXERCISE=${input.name}`,
        `-e`,
        `RUST_BACKTRACE=1`,
        "-v",
        `${repoPath}:/root/student`,
        "--entrypoint",
        "bash",
        "ghcr.io/01-edu/test-rust",
        "-c",
        "cd /root && /app/entrypoint.sh",
      ];

      return dockerRun(args, signal);
    }),

  js: publicProcedure
    .input(z.object({ name: z.string() }))
    .handler(async function ({ input, signal }) {
      const repoPath = `${env.REPOS_DIR}/piscine-js`;

      const args = [
        "run",
        "--rm",
        "-e",
        `EXERCISE=${input.name}`,
        "-v",
        `${repoPath}:/jail/student`,
        "ghcr.io/01-edu/test-js:latest",
      ];

      return dockerRun(args, signal);
    }),
};
