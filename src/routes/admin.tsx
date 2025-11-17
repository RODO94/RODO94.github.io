import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useEmails } from "../hooks/useEmails";
import { EmailCard } from "../components/EmailCard";
import { AddEmailForm } from "../components/AddEmailForm";
import { Button } from "../components/ui/button";
import { TypographyHeader } from "@/components/typography/Header";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { emails, loading, error, refetch } = useEmails();
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Loading emails...</p>
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
        <Button className="align-self-end" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add New Email"}
        </Button>
      </div>

      {
        showAddForm && (
          <div style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <h2>Add New Email Template</h2>
            <AddEmailForm />
          </div>
        )
      }

      <div style={{ marginTop: "2rem" }}>
        <TypographyHeader variant="header-2">Email List</TypographyHeader>
        {!emails || emails.length === 0 ? (
          <p>No emails found.</p>
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
