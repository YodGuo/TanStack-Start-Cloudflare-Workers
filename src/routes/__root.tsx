import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { authMiddleware } from "@/middleware/auth";

interface RouterContext {
  env: Env;
  db: DB;
  session: Session | null;
  user: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  middleware: [authMiddleware],
  component: () => <Outlet />,
});
