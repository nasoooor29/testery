import { z } from "zod";
import { publicProcedure } from "..";
import { dockerRun } from "../utils/docker";
import fs from "fs";
import { ORPCError } from "@orpc/client";
import { getConfig, type PiscineName } from "./config";

async function dockerRunWrapper(args: string[], signal?: AbortSignal) {
  const res = await dockerRun(args, signal);
  if (res.exitCode !== 0) {
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: `Docker exited with code ${res.exitCode}. Output: ${res.output}`,
      data: res,
    });
  }
  return res;
}
function mustGetConfig(piscineName: PiscineName) {
  const config = getConfig();
  if (!config[piscineName]) {
    throw new ORPCError("BAD_REQUEST", {
      message: `Config for ${piscineName} not found`,
    });
  }
  return config[piscineName];
}
export const testerRouter = {
  rust: publicProcedure
    .input(z.object({ name: z.string() }))
    .handler(async function ({ input, signal }) {
      const conf = mustGetConfig("Rust Piscine");
      ensureDir(conf.repo);

      const args = [
        "run",
        "--rm",
        "-e",
        `EXERCISE=${input.name}`,
        `-e`,
        `RUST_BACKTRACE=1`,
        "-v",
        `${conf.repo}:/root/student`,
        "--entrypoint",
        "bash",
        "ghcr.io/01-edu/test-rust",
        "-c",
        "cd /root && /app/entrypoint.sh",
      ];

      return dockerRunWrapper(args, signal);
    }),

  js: publicProcedure
    .input(z.object({ name: z.string() }))
    .handler(async function ({ input, signal }) {
      const conf = mustGetConfig("JS Piscine");
      ensureDir(conf.repo);

      const args = [
        "run",
        "--rm",
        "-e",
        `EXERCISE=${input.name}`,
        "-v",
        `${conf.repo}:/jail/student`,
        "ghcr.io/01-edu/test-js:latest",
      ];

      return dockerRunWrapper(args, signal);
    }),

  bh: publicProcedure
    .input(z.object({ name: z.string() }))
    .handler(async function ({ input, signal }) {
      const conf = mustGetConfig("BH Piscine");
      ensureDir(conf.repo);

      const args = [
        "run",
        "--rm",
        "-w",
        "/root",
        "-e",
        `EXERCISE=${input.name}`,
        "-v",
        `${conf.repo}:/root/student`,
        "ghcr.io/01-edu/test-go:latest",
      ];

      return dockerRunWrapper(args, signal);
    }),

  script: publicProcedure
    .input(z.object({ name: z.string() }))
    .handler(async function ({ input, signal }) {
      const conf = mustGetConfig("Scripting Piscine");
      ensureDir(conf.repo);

      const args = [
        "run",
        "--rm",
        "-w",
        "/tmp",
        "-e",
        `EXERCISE=${input.name}`,
        "-v",
        `${conf.repo}:/tmp/student`,
        "ghcr.io/01-edu/module-sh:latest",
      ];

      return dockerRunWrapper(args, signal);
    }),
};

function ensureDir(repoPath: string) {
  if (!fs.existsSync(repoPath)) {
    throw new ORPCError("BAD_REQUEST", {
      message: `Repo path ${repoPath} does not exist`,
      data: {
        output: `Repo path ${repoPath} does not exist`,
        error: `Repo path ${repoPath} does not exist`,
        exitCode: null,
      },
    });
  }
}
