import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { testerRouter } from "./tester";
import { configRouter, getConfig } from "./config";

export const appRouter = {
  tester: testerRouter,
  conf: configRouter,
  healthCheck: publicProcedure.handler(() => {
    try {
      getConfig();
      return "OK";
    } catch (error) {
      return "invalid config: " + error?.message;
    }
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
