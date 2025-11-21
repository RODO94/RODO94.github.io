import { createFileRoute } from "@tanstack/react-router";
import { fetchEmailById } from "../lib/fetchEmails";
import { generateSendMailto } from "../services/emailService";
import { TypographyBody } from "@/components/typography/Body";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { hasPlaceholders, replacePlaceholders } from "@/services/placeholderService";
import { Separator } from "@/components/ui/separator";
import { TypographyHeader } from "@/components/typography/Header";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner"
import type { Email } from "@/schemas/email/email.schema";

export const Route = createFileRoute("/$emailId")({
  component: EmailerPage,
  loader: async ({ params }) => {
    const { emailId } = params;
    const email = await fetchEmailById(emailId);
    if (email === null) {
      toast.error('Error fetching email')
    }
    return email
  },
});

function EmailerPage() {
  const email = Route.useLoaderData() as Email;
  const [username, setUsername] = useState('');

  const containsPlaceholders: boolean | undefined = useMemo(() => {
    if (email) {
      return hasPlaceholders(email?.emailBody)
    }
  }, [email])

  const mailToLink = useMemo(() => {
    if (!email) return '';
    return generateSendMailto(email, { username: username });
  }, [email, username]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <TypographyHeader variant="header-2">
            {email.title}
          </TypographyHeader>
          <TypographyBody variant='body-1' size='base' >
            {email.description}
          </TypographyBody>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          {containsPlaceholders && (<>
            <div>
              <TypographyBody variant='body-1' size='base'>
                <strong>Enter your name:</strong>
              </TypographyBody>
              <Input type="text" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
            </div>
            <Separator className="my-4" />
          </>)}
          < TypographyBody variant='body-1' size='base'>
            <strong>Subject:</strong> {email.subject}
          </TypographyBody >
          <TypographyBody variant='body-1' size='base'>
            <strong>To:</strong> {email.targetTo}
          </TypographyBody>
          <strong>Body:</strong>
          <TypographyBody variant="body-1" size="base">
            {username ? replacePlaceholders(email.emailBody, { username: username }) : email.emailBody}
          </TypographyBody>
          <Separator className="my-4" />
          <div>
            <TypographyBody variant='body-1' size='base' style="italic">
              When you "Open Email" it will take you to your email app to send the email
            </TypographyBody>
            <br />
            <TypographyBody variant='body-1' size='base' style="italic">
              From here, you can make further changes to the email before sending it.
            </TypographyBody>
          </div>
        </CardContent>
        <CardAction className="flex justify-end gap-1.5">
          <Button variant="secondary" onClick={() => {
            navigator.clipboard.writeText(username ? replacePlaceholders(email.emailBody, { username: username }) : email.emailBody);
            toast.success("Email copied to clipboard")
          }}>Copy Email</Button>
          <a href={mailToLink}>
            <Button variant="primary">Open Email</Button>
          </a>
        </CardAction>
      </Card>
    </div>
  );
}
