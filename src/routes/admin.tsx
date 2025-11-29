import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchEmails } from "../lib/fetchEmails";
import { EmailCard } from "../components/EmailCard";
import { AddEmailForm } from "../components/AddEmailForm";
import { Button } from "../components/ui/button";
import { TypographyHeader } from "@/components/typography/Header";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TypographyBody } from "@/components/typography/Body";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { EmailsArray } from "@/schemas/email/email.schema";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  loader: async () => {
    const emails = await fetchEmails();
    if (emails === null) {
      toast.error('Error fetching emails')
    }
    return emails
  }
});

function AdminPage() {
  const emails = Route.useLoaderData() as EmailsArray | null
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const isAuthenticated = window.sessionStorage.getItem('isAuthenticated')
    if (isAuthenticated) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleValidatePassword = () => {
    if (password.trim() === import.meta.env.VITE_LANDLORDS) {
      window.sessionStorage.setItem('isAuthenticated', 'true')
      setIsAuthenticated(true)
    } else {
      toast.warning('Wrong password, ask an MS member for help')
    }
  }

  if (!isAuthenticated) {
    return (<Card>
      <CardContent className="flex flex-col gap-4 space-y-4" >
        <div>
          <TypographyHeader variant="header-2" >Enter the password</TypographyHeader>
          <TypographyBody variant="body-1" size="base">We have added a password for the admin page. Ask an MS member for help if you don't know it.</TypographyBody>
        </div>
        <Input type="text" value={password} onChange={(e) => {
          setPassword(e.target.value)
        }} />
        <CardAction>
          <Button variant={"primary"} onClick={handleValidatePassword}>Submit</Button>
        </CardAction>
      </CardContent>
    </Card >)
  }

  if (emails === null) {
    toast.error('Error fetching emails')
    return (
      <div style={{ padding: "2rem" }}>
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }


  return (
    <div style={{ padding: "2rem" }}>
      <div className="flex flex-col justify-between items-center mb-4">
        <TypographyHeader variant="header-1" >Admin Panel</TypographyHeader>
      </div>
      <div className="flex justify-end items-center my-8">
        <Button variant={"outline"} className="align-self-end" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Submit New Template"}
        </Button>
      </div>

      {
        showAddForm && (
          <AddEmailForm />
        )
      }

      <div style={{ marginTop: "2rem" }}>
        <TypographyHeader variant="header-2">Template List</TypographyHeader>
        {!emails || emails.length === 0 ? (
          <p>No templates found.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            {emails.map((email) => (
              <EmailCard key={email.emailId} email={email} />
            ))}
          </div>
        )}
      </div>
    </div >
  );
}
