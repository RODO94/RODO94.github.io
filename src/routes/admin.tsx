import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useEmails } from "../hooks/useEmails";
import { EmailCard } from "../components/EmailCard";
import { AddEmailForm } from "../components/AddEmailForm";
import { Button } from "../components/ui/button";
import { TypographyHeader } from "@/components/typography/Header";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TypographyBody } from "@/components/typography/Body";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { emails, loading, error, refetch } = useEmails();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  if (!isAuthenticated) {
    return (<Card>
      <CardContent className="flex flex-col gap-4 space-y-4" >
        <div>
          <TypographyHeader variant="header-2" >Enter the password</TypographyHeader>
          <TypographyBody variant="body-1" size="base">We have added a password for the admin page. Ask an MS member for help if you don't know it.</TypographyBody>
        </div>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <CardAction>
          <Button variant={"primary"} onClick={() => { if (password === import.meta.env.VITE_PASSWORD) setIsAuthenticated(true) }}>Submit</Button>
        </CardAction>
      </CardContent>
    </Card>)
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error</h1>
        <p style={{ color: "red" }}>{error}</p>
        <Button onClick={refetch} style={{ marginTop: "1rem" }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div className="flex flex-col justify-between items-center mb-4">
        <TypographyHeader variant="header-1" >Admin Panel</TypographyHeader>
      </div>
      <div className="flex justify-end items-center my-8">
        <Button variant={"primary"} className="align-self-end" onClick={() => setShowAddForm(!showAddForm)}>
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
