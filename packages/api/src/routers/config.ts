import fs from "fs";
import z from "zod";
import { publicProcedure } from "..";
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
];
const configValueSchema = z.object({ repo: z.string() });
const configSchema = z.record(z.string(), configValueSchema);
// current_file/../../../../config.json
const CONFIG_LOCATION = "../../config.json";

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
    for (const piscine of piscines) {
      if (!parsedConfig.data[piscine]) {
        parsedConfig.data[piscine] = { repo: "" };
      }
    }
    fs.writeFileSync(
      CONFIG_LOCATION,
      JSON.stringify(parsedConfig.data, null, 2),
    );
    return parsedConfig.data;
  }

  // if the config.json file does not exist, create it with all the piscines and empty repo fields
  const conf: {
    [key: string]: {
      repo: string;
    };
  } = {};
  for (const piscine of piscines) {
    conf[piscine] = {
      repo: "",
    };
  }

  // save it to a json file on the project root
  fs.writeFileSync(CONFIG_LOCATION, JSON.stringify(conf, null, 2));
  return conf;
}

export function setConfig(config: z.infer<typeof configSchema>) {
  fs.writeFileSync(CONFIG_LOCATION, JSON.stringify(config, null, 2));
  return config;
}

export const configRouter = {
  getConfig: publicProcedure.handler(async () => {
    const config = getConfig();
    return config;
  }),
  setConfig: publicProcedure.input(configSchema).handler(async ({ input }) => {
    const config = setConfig(input);
    return config;
  }),
};
