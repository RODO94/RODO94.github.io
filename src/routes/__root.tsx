import { MainBox } from "@/components/layout/MainBox";
import { TypographyBody } from "@/components/typography/Body";
import { createRootRoute, Outlet } from "@tanstack/react-router";


export const Route = createRootRoute({
  component: () => (
    <>
      <MainBox>
        <img src="./logo.png" alt="Logo" className="w-24 h-24 cursor-pointer" onClick={() => window.open('https://www.londonrentersunion.org', '_blank')} />
        <Outlet />
        <div className="text-center">
          <TypographyBody variant="body-1" size="sm" style="italic" className="text-[12px]">
            Created by London Renters Union<br />
            <a className="text-primary underline" href="https://www.londonrentersunion.org">click here to learn more</a>
          </TypographyBody>
        </div>
      </MainBox>
    </>
  ),
});
