import { withEventMeta } from "@orpc/server";
import { z } from "zod";
import { spawn } from "node:child_process";

export const TesterLogEvent = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("stdout"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("stderr"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("exit"),
    exitCode: z.number().nullable(),
  }),
]);

export function dockerStream(args: string[], signal?: AbortSignal) {
  return async function* () {
    const proc = spawn("docker", args);

    let id = 0;
    const queue: z.infer<typeof TesterLogEvent>[] = [];
    let done = false;

    const push = (event: z.infer<typeof TesterLogEvent>) => {
      queue.push(event);
    };

    proc.stdout.on("data", (data) => {
      push({ type: "stdout", text: data.toString() });
    });

    proc.stderr.on("data", (data) => {
      push({ type: "stderr", text: data.toString() });
    });

    proc.on("close", (exitCode) => {
      push({ type: "exit", exitCode });
      done = true;
    });

    proc.on("error", (err) => {
      push({ type: "stderr", text: err.message });
      done = true;
    });

    signal?.addEventListener("abort", () => {
      proc.kill("SIGKILL");
      done = true;
    });

    try {
      while (!done || queue.length > 0) {
        signal?.throwIfAborted();

        const event = queue.shift();

        if (event) {
          yield withEventMeta(event, {
            id: String(++id),
          });
        } else {
          await new Promise((r) => setTimeout(r, 25));
        }
      }
    } finally {
      if (!proc.killed) proc.kill("SIGKILL");
    }
  };
}

export interface DockerRunResponse {
  output: string;
  error?: string;
  exitCode: number | null;
}
export async function dockerRun(
  args: string[],
  signal?: AbortSignal,
): Promise<DockerRunResponse> {
  return await new Promise((resolve, reject) => {
    const proc = spawn("docker", args);

    let output = "";

    proc.stdout.on("data", (data) => {
      console.log("Docker stdout:", data.toString());
      output += data.toString();
    });

    proc.stderr.on("data", (data) => {
      console.error("Docker stderr:", data.toString());
      output += data.toString();
    });

    proc.once("error", (err) => {
      reject({
        output,
        exitCode: null,
        error: err.message,
      });
    });

    proc.once("close", (code) => {
      if (code === 0) {
        resolve({
          output,
          exitCode: code,
        });
      } else {
        reject({
          output,
          exitCode: code,
          error: `Docker exited with code ${code}`,
        });
      }
    });

    signal?.addEventListener(
      "abort",
      () => {
        proc.kill("SIGKILL");
        reject({
          output,
          exitCode: null,
          error: "Aborted",
        });
      },
      { once: true },
    );
  });
}
