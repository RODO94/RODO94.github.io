import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useEmails } from "../hooks/useEmails";
import { EmailCard } from "../components/EmailCard";
import { AddEmailForm } from "../components/AddEmailForm";
import { Button } from "../components/ui/button";

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Admin Panel</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add New Email"}
        </Button>
      </div>

      {showAddForm && (
        <div style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
          <h2>Add New Email Template</h2>
          <AddEmailForm />
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>Email List</h2>
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
    </div>
  );
}
