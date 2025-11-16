import { MainBox } from "@/components/layout/MainBox";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainBox>
      <p>Welcome to the emailer app.</p>
      <p>This is the home page of the emailer app.</p>
      <p>Here you can see all the emails that have been sent.</p>
      <p>You can also click on an email to see the details of that email.</p>
      Hello "/"!
    </MainBox>
  );
}
