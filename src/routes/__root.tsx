import { MainBox } from "@/components/layout/MainBox";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <MainBox>
        <img src="./logo.png" alt="Logo" className="w-24 h-24" />
        <Outlet />
      </MainBox>
    </>
  ),
});
