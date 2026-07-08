import fs from "fs";
import z from "zod";
import { publicProcedure } from "..";
import { ORPCError } from "@orpc/server";
// NOTE: pull it from data.ts and make it a package so both frontend and backend can use it

const piscines = [
  "BH Piscine",
  "Rust Piscine",
  "Java Piscine",
  "JS Piscine",
  "Flutter Piscine",
  "Main checkpoint",
  "UX Piscine",
  "UI Piscine",
  "Blockchain Piscine",
  "Scripting Piscine",
  "Prompting Piscine",
  "AI Piscine",
  "AI Forge Piscine",
] as const;
const configValueSchema = z.object({ repo: z.string() });
const configSchema = z.record(z.literal(piscines), configValueSchema);
// current_file/../../../../config.json
const CONFIG_LOCATION = "../../config.json";

// this will return the same config but with additional field which is notValidReason
// if dir does not exist, it will be set to "dir does not exist"
function returnWithValid(c: z.infer<typeof configSchema>) {
  const result: Record<string, { repo: string; notValidReason?: string }> = {};
  for (const piscine of piscines) {
    const repoPath = c[piscine].repo;
    if (!fs.existsSync(repoPath)) {
      result[piscine] = {
        repo: repoPath,
        notValidReason: "dir does not exist",
      };
    } else {
      result[piscine] = { repo: repoPath };
    }
  }
  return result;
}

// this config will be a json file on the project root, and will contain the piscines repos locations
export function getConfig() {
  // if the config.json file already exists, load it and if any field missing set it
  if (fs.existsSync(CONFIG_LOCATION)) {
    const configFile = fs.readFileSync(CONFIG_LOCATION, "utf-8");
    const config = JSON.parse(configFile);
    const parsedConfig = configSchema.safeParse(config);
    if (!parsedConfig.success) {
      throw new Error("Invalid config.json file");
    }
    const anyMissing = piscines.some((piscine) => !parsedConfig.data[piscine]);
    if (!anyMissing) {
      return returnWithValid(parsedConfig.data);
    }
    for (const piscine of piscines) {
      if (!parsedConfig.data[piscine]) {
        parsedConfig.data[piscine] = { repo: "" };
      }
    }
    if (anyMissing) {
      fs.writeFileSync(
        CONFIG_LOCATION,
        JSON.stringify(parsedConfig.data, null, 2),
      );
    }
    return returnWithValid(parsedConfig.data);
  }

  // if the config.json file does not exist, create it with all the piscines and empty repo fields
  const conf: z.infer<typeof configSchema> = {} as z.infer<typeof configSchema>;
  for (const piscine of piscines) {
    conf[piscine] = {
      repo: "",
    };
  }

  // save it to a json file on the project root
  fs.writeFileSync(CONFIG_LOCATION, JSON.stringify(conf, null, 2));
  return returnWithValid(conf);
}

export function setConfig(config: z.infer<typeof configSchema>) {
  fs.writeFileSync(CONFIG_LOCATION, JSON.stringify(config, null, 2));
  return config;
}

export const configRouter = {
  getConfig: publicProcedure.handler(async () => {
    try {
      const config = getConfig();
      return config;
    } catch (error) {
      console.error("Error getting config:", error);
      throw new ORPCError("BAD_REQUEST", {
        message: error.message,
      });
    }
  }),
  setConfig: publicProcedure.input(configSchema).handler(async ({ input }) => {
    try {
      getConfig();
      const config = setConfig(input);
      getConfig(); // validate the config after setting it

      return config;
    } catch (error) {
      console.error("Error getting config:", error);
      throw new ORPCError("BAD_REQUEST", {
        message: error.message,
      });
    }
  }),
};
