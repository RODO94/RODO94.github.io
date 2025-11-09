import { createFileRoute } from "@tanstack/react-router";
import emailData from "../data/emails.json";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>
      <p>Full Email Database</p>

      <div style={{ marginTop: "1rem" }}>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(emailData, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Email List</h2>
        {Object.entries(emailData).map(([emailId, email]) => (
          <div
            key={emailId}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <h3>{emailId}</h3>
            <p>
              <strong>Subject:</strong> {email.subject}
            </p>
            <p>
              <strong>Sender:</strong> {email.sender}
            </p>
            <p>
              <strong>Body:</strong> {email.body}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(email.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
