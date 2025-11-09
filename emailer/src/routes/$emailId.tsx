import { createFileRoute } from "@tanstack/react-router";
import emailData from "../data/emails.json";

export const Route = createFileRoute("/$emailId")({
  component: EmailerPage,
});

function EmailerPage() {
  const { emailId } = Route.useParams();
  const email = emailData[emailId as keyof typeof emailData];

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
      <h1>Email Details</h1>
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <p>
          <strong>ID:</strong> {emailId}
        </p>
        <p>
          <strong>Subject:</strong> {email.subject}
        </p>
        <p>
          <strong>Sender:</strong> {email.sender}
        </p>
        <p>
          <strong>Created:</strong> {new Date(email.createdAt).toLocaleString()}
        </p>
        <div style={{ marginTop: "1rem" }}>
          <strong>Body:</strong>
          <p>{email.body}</p>
        </div>
      </div>
    </div>
  );
}
