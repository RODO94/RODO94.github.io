import { createFileRoute } from "@tanstack/react-router";
import { fetchEmailById } from "../lib/fetchEmails";
import { formatCcList, formatEmailForClipboard, generateSendMailto } from "../services/emailService";
import { TypographyBody } from "@/components/typography/Body";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { hasPlaceholders, replacePlaceholders } from "@/services/placeholderService";
import { Separator } from "@/components/ui/separator";
import { TypographyHeader } from "@/components/typography/Header";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner"
import { Copy } from "lucide-react";
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

interface RecipientRowProps {
  label: string;
  addresses: string;
  copyLabel: string;
  copiedMessage: string;
}

/**
 * A recipient line with a copy button on the right, so the addresses can be
 * pasted straight into an email app that did not pick them up from the mailto link.
 */
function RecipientRow({ label, addresses, copyLabel, copiedMessage }: RecipientRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <TypographyBody variant='body-1' size='base'>
        <strong>{label}:</strong> {addresses}
      </TypographyBody>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={copyLabel}
        title={copyLabel}
        onClick={() => {
          navigator.clipboard.writeText(addresses);
          toast.success(copiedMessage);
        }}
      >
        <Copy />
      </Button>
    </div>
  );
}

function EmailerPage() {
  const email = Route.useLoaderData() as Email;
  const [username, setUsername] = useState('');
  const ccAddresses = email.targetCc ?? [];

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
    <div className="p-6" >
      <Card>
        <CardHeader>
          <TypographyHeader variant="header-2">
            {email.title}
          </TypographyHeader>
          <TypographyBody variant='body-1' size='base' className="whitespace-pre-wrap">
            {email.description}
          </TypographyBody>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          {containsPlaceholders && (<>
            <div>
              <TypographyBody variant='body-1' size='base' className="font-bold">
                Your name
              </TypographyBody>
              <TypographyBody variant='body-3' size='sm' className="mb-3">
                This will be automatically added to the email
              </TypographyBody>
              <Input type="text" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
            </div>
            <Separator className="my-4" />
          </>)}
          < TypographyBody variant='body-1' size='base'>
            <strong>Subject:</strong> {email.subject}
          </TypographyBody >
          <RecipientRow
            label="To"
            addresses={email.targetTo}
            copyLabel="Copy To address"
            copiedMessage="To address copied"
          />
          {ccAddresses.length > 0 && (
            <>
              <RecipientRow
                label="Cc"
                addresses={formatCcList(ccAddresses)}
                copyLabel="Copy Cc addresses"
                copiedMessage="Cc addresses copied"
              />
              <TypographyBody variant='body-3' size='sm' className="mb-2">
                Check these appear in your email app's Cc field — some apps drop them.
              </TypographyBody>
            </>
          )}
          <strong>Body:</strong>
          <TypographyBody variant="body-1" size="base" className="whitespace-pre-wrap">
            {username ? replacePlaceholders(email.emailBody, { username: username }) : email.emailBody}
          </TypographyBody>
          <Separator className="my-4" />

        </CardContent>
        <CardAction className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <a href={mailToLink}>
              <Button variant="secondary" className="w-full">Open in email app</Button>
            </a>
            <TypographyBody variant='body-3' size='sm' className="w-full">
              This opens the template in your email app. You still need to send the email in the app.
            </TypographyBody>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button variant="secondary" className="w-full" onClick={() => {
              navigator.clipboard.writeText(formatEmailForClipboard(email, { username: username }));
              toast.success("Email copied to clipboard")
            }}>Copy template</Button>
            <TypographyBody variant='body-3' size='sm' className="w-full">
              This copies the template to your clipboard.
            </TypographyBody>
          </div>
        </CardAction>
      </Card>
    </div>
  );
}
