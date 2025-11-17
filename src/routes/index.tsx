import { MainBox } from "@/components/layout/MainBox";
import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainBox>
      <p>Welcome to the emailer app from Hackney London Renters Union</p>
      <br />
      <p>Travel to the admin page to see all the emails that have been sent.</p>
      <Button>
        <Link to="/admin">Go to admin page</Link>
      </Button>
    </MainBox>
  );
}
