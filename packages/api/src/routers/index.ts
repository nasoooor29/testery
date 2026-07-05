import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { testerRouter } from "./tester";

export const appRouter = {
  tester: testerRouter,
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
