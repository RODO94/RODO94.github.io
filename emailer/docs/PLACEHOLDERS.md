# Email Placeholder Personalization

The emailer app supports dynamic placeholders in email templates using the `{{placeholder}}` notation. This allows you to create personalized emails by replacing placeholders with actual values at send time.

## Overview

Placeholders enable you to create reusable email templates that can be customized for each recipient. Instead of writing "Hi John" in every email, you can write "Hi {{username}}" in the template and provide the name when sending.

## Syntax

Placeholders use double curly braces:

```
{{placeholderName}}
```

**Rules:**
- Must start and end with double curly braces: `{{` and `}}`
- Placeholder names can contain: letters (a-z, A-Z), numbers (0-9), and underscores (_)
- No spaces allowed inside the braces
- Case-sensitive: `{{username}}` and `{{userName}}` are different placeholders

**Valid Examples:**
- `{{username}}`
- `{{firstName}}`
- `{{company}}`
- `{{meeting_date}}`
- `{{projectName2}}`

**Invalid Examples:**
- `{{ username }}` (spaces inside braces)
- `{username}` (single braces)
- `{{user-name}}` (hyphens not allowed)
- `{{user name}}` (spaces in name)

## Usage in Email Templates

Placeholders can be used in both the email subject and body:

### Example 1: Simple Welcome Email

```json
{
  "emailId": "welcome-email",
  "subject": "Welcome to Our Service, {{username}}!",
  "targetTo": "user@example.com",
  "emailBody": "Hi {{username}},\\n\\nWelcome! We're excited to have you on board.\\n\\nBest regards,\\nThe Team",
  "createdOn": "2025-01-15T10:30:00Z",
  "createdBy": "admin"
}
```

**Placeholders used:** `username`

**After replacement** (with `username: "John"`):
- **Subject:** "Welcome to Our Service, John!"
- **Body:** "Hi John,\n\nWelcome! We're excited to have you on board.\n\nBest regards,\nThe Team"

### Example 2: Meeting Invitation

```json
{
  "emailId": "meeting-invitation",
  "subject": "Meeting Invitation: {{meetingTopic}}",
  "targetTo": "colleague@example.com",
  "emailBody": "Hi {{username}},\\n\\nYou're invited to a meeting about {{meetingTopic}}.\\n\\nDate: {{meetingDate}}\\nTime: {{meetingTime}}\\nLocation: {{location}}\\n\\nPlease confirm your attendance.\\n\\nBest regards,\\n{{organizer}}",
  "createdOn": "2025-01-18T11:00:00Z",
  "createdBy": "admin"
}
```

**Placeholders used:** `username`, `meetingTopic`, `meetingDate`, `meetingTime`, `location`, `organizer`

**After replacement:**
```javascript
const values = {
  username: "Sarah",
  meetingTopic: "Q1 Planning",
  meetingDate: "Jan 25, 2025",
  meetingTime: "2:00 PM",
  location: "Conference Room B",
  organizer: "Mike"
};
```

Result:
- **Subject:** "Meeting Invitation: Q1 Planning"
- **Body:** "Hi Sarah,\n\nYou're invited to a meeting about Q1 Planning.\n\nDate: Jan 25, 2025\nTime: 2:00 PM\nLocation: Conference Room B\n\nPlease confirm your attendance.\n\nBest regards,\nMike"

## API Usage

### Extracting Placeholders

To find out what placeholders are in an email template:

```typescript
import { extractPlaceholders } from './services/placeholderService';

const text = "Hi {{username}}, welcome to {{company}}!";
const placeholders = extractPlaceholders(text);
// Returns: ["username", "company"]
```

For complete email templates:

```typescript
import { getEmailPlaceholders } from './services/emailService';

const email = getEmailById('welcome-email');
const placeholders = getEmailPlaceholders(email);
// Returns: ["username"] (checks both subject and body)
```

### Replacing Placeholders

```typescript
import { replacePlaceholders } from './services/placeholderService';

const text = "Hi {{username}}, welcome to {{company}}!";
const values = { username: "John", company: "Acme Corp" };

const result = replacePlaceholders(text, values);
// Returns: "Hi John, welcome to Acme Corp!"
```

**Options:**

```typescript
// Keep unreplaced placeholders (default behavior)
replacePlaceholders(text, { username: "John" }, { keepUnmatched: true });
// Returns: "Hi John, welcome to {{company}}!"

// Remove unreplaced placeholders
replacePlaceholders(text, { username: "John" }, { keepUnmatched: false });
// Returns: "Hi John, welcome to !"
```

### Validating Placeholders

Before sending an email, validate that all required values are provided:

```typescript
import { validatePlaceholders } from './services/placeholderService';

const text = "Hi {{username}}, welcome to {{company}}!";
const values = { username: "John" };

const validation = validatePlaceholders(text, values);
// Returns: { isValid: false, missingPlaceholders: ["company"] }
```

### Generating mailto Links with Placeholders

```typescript
import { generateSendMailto } from './services/emailService';

const email = getEmailById('welcome-email');

// Without placeholder values (keeps placeholders as-is)
const mailtoWithoutValues = generateSendMailto(email);

// With placeholder values (replaces placeholders)
const mailtoWithValues = generateSendMailto(email, {
  username: "John"
});
```

## UI Integration Examples

### Display Required Placeholders to User

```typescript
import { getPlaceholderDescriptions } from './services/placeholderService';

const email = getEmailById('meeting-invitation');
const placeholders = getPlaceholderDescriptions(email.emailBody);

// Display to user:
placeholders.forEach(({ name, display }) => {
  console.log(`Please provide a value for ${display}`);
});

// Output:
// Please provide a value for {{username}}
// Please provide a value for {{meetingTopic}}
// Please provide a value for {{meetingDate}}
// ...etc
```

### Form for Collecting Placeholder Values

```jsx
import { getEmailPlaceholders } from './services/emailService';
import { useState } from 'react';

function SendEmailForm({ email }) {
  const placeholders = getEmailPlaceholders(email);
  const [values, setValues] = useState({});

  return (
    <form>
      {placeholders.map(placeholder => (
        <div key={placeholder}>
          <label>{placeholder}:</label>
          <input
            value={values[placeholder] || ''}
            onChange={e => setValues({
              ...values,
              [placeholder]: e.target.value
            })}
          />
        </div>
      ))}
      
      <a href={generateSendMailto(email, values)}>
        Send Email
      </a>
    </form>
  );
}
```

## Best Practices

### 1. Use Descriptive Placeholder Names

✅ Good:
- `{{firstName}}`
- `{{meetingDate}}`
- `{{projectName}}`

❌ Bad:
- `{{x}}`
- `{{temp}}`
- `{{thing}}`

### 2. Be Consistent with Naming Conventions

Choose either camelCase or snake_case and stick with it:

✅ Consistent:
- `{{firstName}}`, `{{lastName}}`, `{{companyName}}`
- `{{first_name}}`, `{{last_name}}`, `{{company_name}}`

❌ Inconsistent:
- `{{firstName}}`, `{{last_name}}`, `{{CompanyName}}`

### 3. Document Required Placeholders

Add comments in your email templates or documentation about what placeholders are available:

```json
{
  "emailId": "welcome-email",
  "subject": "Welcome {{username}}!",
  "emailBody": "Hi {{username}}...",
  "createdBy": "admin",
  "comment": "Required placeholders: username"
}
```

### 4. Provide Fallback Values

When displaying emails without replacement, consider showing helpful defaults:

```typescript
const values = {
  username: formData.username || "[Name]",
  company: formData.company || "[Company]"
};
```

### 5. Validate Before Sending

Always validate that all placeholders have values before generating the mailto link:

```typescript
const validation = validatePlaceholders(email.emailBody, values);

if (!validation.isValid) {
  alert(`Missing values for: ${validation.missingPlaceholders.join(', ')}`);
  return;
}

// Safe to proceed
const mailtoLink = generateSendMailto(email, values);
```

## Common Use Cases

### 1. Personalized Greetings
```
Hi {{username}},
Dear {{firstName}} {{lastName}},
Hello {{title}} {{lastName}},
```

### 2. Event/Meeting Details
```
Date: {{eventDate}}
Time: {{eventTime}}
Location: {{venue}}
Meeting link: {{zoomLink}}
```

### 3. Business Context
```
Order #{{orderNumber}}
Invoice: {{invoiceId}}
Project: {{projectName}}
Reference: {{ticketNumber}}
```

### 4. Dynamic Content
```
Your balance: {{balance}}
Status: {{currentStatus}}
Next steps: {{actionItems}}
```

## Troubleshooting

### Placeholders Not Being Replaced

**Issue:** Placeholders remain as `{{username}}` in the email

**Solutions:**
1. Check you're passing values to `generateSendMailto()`:
   ```typescript
   // ❌ Wrong
   generateSendMailto(email)
   
   // ✅ Correct
   generateSendMailto(email, { username: "John" })
   ```

2. Verify placeholder names match exactly (case-sensitive):
   ```typescript
   // Template has: {{username}}
   // ❌ Won't work: { userName: "John" }
   // ✅ Will work: { username: "John" }
   ```

### Placeholder Format Invalid

**Issue:** Placeholder not being recognized

**Check:**
- No spaces inside braces: `{{username}}` not `{{ username }}`
- Double braces: `{{username}}` not `{username}`
- Valid characters only: letters, numbers, underscores
- No special characters: `{{user-name}}` won't work

### Some Placeholders Missing

**Issue:** Some placeholders replaced, others not

**Solution:** Use `validatePlaceholders()` to find missing values:

```typescript
const validation = validatePlaceholders(email.emailBody, values);
console.log('Missing:', validation.missingPlaceholders);
```

## Future Enhancements

Potential features for future versions:

- **Default values:** `{{username:Guest}}` uses "Guest" if no value provided
- **Transformations:** `{{username|uppercase}}` applies formatting
- **Conditional sections:** `{{#if premium}}...{{/if}}` includes content conditionally
- **Date formatting:** `{{date|format:MM/DD/YYYY}}` formats dates
- **Nested placeholders:** Access object properties like `{{user.firstName}}`

---

For more details on the implementation, see:
- `src/services/placeholderService.ts` - Core placeholder utilities
- `src/services/emailService.ts` - Email service with placeholder support
- `src/data/emails.json` - Sample emails with placeholders
