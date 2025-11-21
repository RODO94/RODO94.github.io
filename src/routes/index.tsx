import { TypographyBody } from "@/components/typography/Body";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className="bg-background text-foreground" color="background">
      <CardContent>
        <TypographyBody variant="body-3" size="base">Welcome to the emailer app from Hackney London Renters Union</TypographyBody>
        <br />
        <TypographyBody variant="body-3" size="base">Travel to the admin page to see all the emails that have been sent.</TypographyBody>
        <br />
        <CardAction>
          <Button variant={"primary"}>
            <Link to="/admin">Go to admin page</Link>
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}
