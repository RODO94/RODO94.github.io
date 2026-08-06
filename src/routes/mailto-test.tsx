import { createFileRoute } from "@tanstack/react-router";
import { TypographyBody } from "@/components/typography/Body";
import { TypographyHeader } from "@/components/typography/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * TEMPORARY diagnostic page. Delete this file once the iOS paragraph question
 * is settled — it is deliberately self-contained (no imports from
 * emailService) so removing it cannot leave anything dangling behind.
 *
 * Some email apps keep the paragraph breaks in a mailto body and some collapse
 * them into one block. Each variant below changes exactly one thing, so
 * whichever ones survive on the affected device tell us why.
 */

export const Route = createFileRoute("/mailto-test")({
  component: MailtoTestPage,
});

const TEST_TO = "mailto-test@example.com";
const TEST_CC = "mailto-test-cc@example.com";
const TEST_SUBJECT = "Mailto paragraph test";

const TEST_ISSUES = [
  "Black mould in the shared bathroom, on the bedroom window sills and inside the wardrobe, made worse by a windowless and unventilated basement room, and a serious risk to the tenants respiratory health",
  "A clogged and leaking kitchen drain causing repeated floods across the floor and repeated failures of the communal washing machine used by every tenant in the building",
  "A clogged bathroom drain causing waste water and scum to pool in the bathtub after every single use, leaving the only washing facility unusable for hours at a time",
  "A broken door handle preventing the tenant from securing their own room whenever they leave the property, in a shared house with a communal front door",
  "A rodent hole in the communal kitchen fire door, which is also missing its intumescent strip and does not close properly against its frame, a serious fire safety failure given the heightened fire risk in kitchens",
  "A rodent hole in the back door, giving pests direct access to the kitchen and to the bin area beyond it, with droppings found on food preparation surfaces",
  "Water pressure insufficient to serve the propertys five tenants whenever more than one outlet is in use, so that a running tap stops the shower entirely",
  "Inadequate emergency lighting in the basement hallway, leaving the corridor outside the bedroom in complete darkness, which was also observed and noted during an inspection",
  "A neglected and unsafe backyard with loose paving tiles, broken glass and accumulated rubbish left uncollected for several months despite repeated requests",
  "A hole in the internal wall beside the front door, left unrepaired since it was first reported to the managing agent at the start of the tenancy",
];

/**
 * Synthetic body matching a real campaign in shape and length, so the test
 * reproduces the failure. Not real campaign text — nobody should mistake a
 * test tap for a live send.
 */
const LONG_BODY = [
  "Dear Test Recipient,",
  "",
  "This is a TEST message from the London Renters Union emailer tool. Please do not send it. It exists only to check whether your email app keeps the paragraph breaks below when it opens this draft.",
  "",
  "Each numbered point should sit in its own block, with a blank line between it and the next one. If they all run together into a single unbroken wall of text, then this variant has failed the test and that is exactly what we need to know.",
  "",
  "The body below is deliberately the same length and shape as a real campaign email, because the length of the link may itself be part of the problem we are trying to isolate.",
  "",
  ...TEST_ISSUES.flatMap((issue, index) => [`${index + 1}. ${issue}`, ""]),
  "These issues were first reported some months ago, and again on several later dates, plus in person during an on-site visit. The tenant has received only two generic acknowledgements in response. No schedule of works has been provided and no repairs have been carried out.",
  "",
  "A request was made to confirm a schedule of repairs within five working days. That deadline has now passed with no meaningful response of any kind, which is why this template exists in the first place.",
  "",
  "That is the end of the test message. Please close this draft without sending it, then go back to the test page and try the next link in the list.",
  "",
  "Kind regards,",
  "Test Sender",
].join("\n");

const SHORT_BODY = [
  "Dear Test Recipient,",
  "",
  "This is paragraph one of the short test body. Please do not send this message.",
  "",
  "This is paragraph two, which should sit in its own separate block.",
  "",
  "Kind regards,",
  "Test Sender",
].join("\n");

/** Bare line feeds — what the app sends today. */
function encodeWithLf(body: string): string {
  return encodeURIComponent(body);
}

/** CRLF line breaks — the form RFC 6068 specifies. */
function encodeWithCrlf(body: string): string {
  return encodeURIComponent(body.replace(/\r?\n/g, "\r\n"));
}

/**
 * HTML line break tags. Never shippable — plain text clients show the literal
 * markup. Included only to prove whether the receiving composer is HTML.
 */
function encodeWithBrTags(body: string): string {
  return encodeURIComponent(body.replace(/\r?\n/g, "<br>"));
}

function buildTestMailto(body: string, encodeBody: (body: string) => string): string {
  return `mailto:${TEST_TO}?cc=${TEST_CC}&subject=${encodeURIComponent(TEST_SUBJECT)}&body=${encodeBody(body)}`;
}

interface TestVariant {
  id: string;
  encoding: string;
  bodyLabel: string;
  isolates: string;
  href: string;
}

const VARIANTS: TestVariant[] = [
  {
    id: "A",
    encoding: "%0A (line feed)",
    bodyLabel: "Long",
    isolates: "Control — exactly what the app sends today",
    href: buildTestMailto(LONG_BODY, encodeWithLf),
  },
  {
    id: "B",
    encoding: "%0D%0A (carriage return + line feed)",
    bodyLabel: "Long",
    isolates: "Whether the app needs the RFC 6068 line break form",
    href: buildTestMailto(LONG_BODY, encodeWithCrlf),
  },
  {
    id: "C",
    encoding: "%0A (line feed)",
    bodyLabel: "Short",
    isolates: "Whether the length of the link is the real problem",
    href: buildTestMailto(SHORT_BODY, encodeWithLf),
  },
  {
    id: "D",
    encoding: "%0D%0A (carriage return + line feed)",
    bodyLabel: "Short",
    isolates: "Length and line break form together",
    href: buildTestMailto(SHORT_BODY, encodeWithCrlf),
  },
  {
    id: "E",
    encoding: "<br> tags",
    bodyLabel: "Short",
    isolates: "Whether the app drops the text into an HTML editor",
    href: buildTestMailto(SHORT_BODY, encodeWithBrTags),
  },
];

function MailtoTestPage() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <TypographyHeader variant="header-2">Mailto paragraph test</TypographyHeader>
          <TypographyBody variant="body-1" size="base">
            Some email apps keep the paragraph breaks in these test emails and some
            squash everything into one block. We need to find out which of the five
            links below survives on your phone.
          </TypographyBody>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Separator />
          <TypographyBody variant="body-1" size="base" className="font-bold">
            What to do
          </TypographyBody>
          <ol className="list-decimal pl-5 flex flex-col gap-2">
            <li>
              <TypographyBody variant="body-1" size="base">
                Tap link A below. Your email app should open a new draft.
              </TypographyBody>
            </li>
            <li>
              <TypographyBody variant="body-1" size="base">
                Look at the draft. Are the numbered points in separate blocks with
                gaps between them, or has it all run together into one paragraph?
              </TypographyBody>
            </li>
            <li>
              <TypographyBody variant="body-1" size="base">
                Check whether the <strong>Cc</strong> field has an address in it.
              </TypographyBody>
            </li>
            <li>
              <TypographyBody variant="body-1" size="base">
                <strong>Delete the draft. Do not send it.</strong> Then come back
                here and do the same for B, C, D and E.
              </TypographyBody>
            </li>
            <li>
              <TypographyBody variant="body-1" size="base">
                Tell us which letters kept the gaps, whether Cc was filled in, and
                your iOS version and Gmail app version.
              </TypographyBody>
            </li>
          </ol>
          <TypographyBody variant="body-3" size="sm">
            These are test addresses at example.com. Nothing reaches a real person,
            but please delete each draft anyway.
          </TypographyBody>
        </CardContent>
      </Card>

      {VARIANTS.map((variant) => (
        <Card key={variant.id}>
          <CardContent className="flex flex-col gap-2 pt-6">
            <TypographyHeader variant="header-3">Link {variant.id}</TypographyHeader>
            <TypographyBody variant="body-1" size="base">
              <strong>Line breaks:</strong> {variant.encoding}
            </TypographyBody>
            <TypographyBody variant="body-1" size="base">
              <strong>Body:</strong> {variant.bodyLabel} ({variant.href.length} character link)
            </TypographyBody>
            <TypographyBody variant="body-3" size="sm">
              Checking: {variant.isolates}
            </TypographyBody>
            <a href={variant.href}>
              <Button variant="secondary" className="w-full mt-2">
                Open link {variant.id} in email app
              </Button>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
