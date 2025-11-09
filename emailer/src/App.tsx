import { Link } from "@tanstack/react-router";
import emailData from "./data/emails.json";
import "./App.css";

function App() {
  const emailIds = Object.keys(emailData);
  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Email Home</h1>
        <p>Welcome to the Email App</p>

        <h2>Available Emails:</h2>
        <ul>
          {emailIds.map((emailId) => (
            <li key={emailId}>
              <Link to={`/${emailId}`}>{emailId}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
