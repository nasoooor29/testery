import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { testerRouter } from "./tester";
import { configRouter, getConfig } from "./config";

export const appRouter = {
  tester: testerRouter,
  conf: configRouter,
  healthCheck: publicProcedure.handler(() => {
    getConfig();
    return "OK";
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
