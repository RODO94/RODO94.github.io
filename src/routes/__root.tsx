import { MainBox } from "@/components/layout/MainBox";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <MainBox>
        <img src="./public/logo.png" alt="Logo" className="w-24 h-24" />
        <Outlet />
        <TanStackRouterDevtools />
      </MainBox>
    </>
  ),
});
