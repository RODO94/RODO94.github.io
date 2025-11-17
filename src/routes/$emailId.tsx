import { createFileRoute } from "@tanstack/react-router";
import { useEmailById } from "../hooks/useEmails";
import { generateSendMailto } from "../services/emailService";
import { TypographyBody } from "@/components/typography/Body";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { hasPlaceholders, replacePlaceholders } from "@/services/placeholderService";
import { Separator } from "@/components/ui/separator";
import { TypographyHeader } from "@/components/typography/Header";

export const Route = createFileRoute("/$emailId")({
  component: EmailerPage,
});

function EmailerPage() {
  const { emailId } = Route.useParams();
  const { email, error } = useEmailById(emailId);
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

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Email Not Found</h1>
        <p>The email with ID "{emailId}" does not exist.</p>
      </div>
    );
  }




  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <TypographyHeader variant="header-2">
          {email.title}
        </TypographyHeader>
        <TypographyBody variant='body-1' size='base' >
          {email.description}
        </TypographyBody>
        <Separator className="my-4" />
        {containsPlaceholders && (<>
          <TypographyBody variant='body-1' size='base'>
            <strong>Enter your name:</strong>
          </TypographyBody>
          <Input type="text" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          <Separator className="my-4" />
        </>)}
        < TypographyBody variant='body-1' size='base'>
          <strong>Subject:</strong> {email.subject}
        </TypographyBody >
        <TypographyBody variant='body-1' size='base'>
          <strong>To:</strong> {email.targetTo}
        </TypographyBody>
        <div style={{ marginTop: "1rem" }}>
          <strong>Body:</strong>
          <p style={{ whiteSpace: "pre-wrap" }}>{username ? replacePlaceholders(email.emailBody, { username: username }) : email.emailBody}</p>
        </div>
        <Separator className="my-4" />
        <TypographyBody variant='body-1' size='base' style="italic">
          When you "Open Email" you can make further changes to the email before sending it.
        </TypographyBody>
        <div style={{ marginTop: "1.5rem" }}>
          <a href={mailToLink}>
            <Button>Open Email</Button>
          </a>
        </div>
      </div>
    </div >
  );
}
