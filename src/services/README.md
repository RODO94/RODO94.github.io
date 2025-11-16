# Email Service API

The email service provides functions for loading, validating, and working with email templates.

## Functions

### `loadEmails(): EmailsArray`

Loads and validates all emails from the JSON data store.

- **Returns**: Validated array of email templates
- **Throws**: Error if validation fails or data format is invalid
- **Validation**: Uses Zod to validate the entire array in one operation
- **Compatibility**: Automatically converts object format to array format if needed

**Example:**
```typescript
import { loadEmails } from './services/emailService';

try {
  const emails = loadEmails();
  console.log(`Loaded ${emails.length} emails`);
} catch (error) {
  console.error('Failed to load emails:', error.message);
}
```

---

### `getEmailById(id: string): Email`

Get a single email by its ID from the array of emails.

- **Parameters**:
  - `id` - The email ID to search for
- **Returns**: The email object if found
- **Throws**: Error if email not found or validation fails
- **Validation**: Re-validates the single email for extra safety

**Example:**
```typescript
import { getEmailById } from './services/emailService';

try {
  const email = getEmailById('welcome-email');
  console.log(email.subject);
} catch (error) {
  console.error('Email not found:', error.message);
}
```

---

### `formatEmailForSubmission(email: Email): string`

Format an email object as a JSON string for submission.

- **Parameters**:
  - `email` - The email object to format
- **Returns**: Formatted JSON string ready for copy/paste
- **Formatting**: Pretty-printed with 2-space indentation

**Example:**
```typescript
import { formatEmailForSubmission } from './services/emailService';

const email = { /* ... */ };
const json = formatEmailForSubmission(email);
console.log(json);
```

---

### `generateSubmitMailto(email: Email): string`

Generate a mailto link for submitting a new email template to rory.doak@gmail.com.

- **Parameters**:
  - `email` - The email template to submit
- **Returns**: Complete mailto URL with encoded parameters
- **Email Format**:
  - **To**: `rory.doak@gmail.com`
  - **Subject**: `New Email Template Submission - [emailId]`
  - **Body**: Formatted JSON with instructions for copy/paste

**Example:**
```typescript
import { generateSubmitMailto } from './services/emailService';

const email = { /* ... */ };
const mailtoLink = generateSubmitMailto(email);
// Use in an anchor tag: <a href={mailtoLink}>Submit Email</a>
```

---

### `generateSendMailto(email: Email, placeholderValues?: Record<string, string>): string`

Generate a mailto link for sending an email using the template.
Supports placeholder replacement for email personalization.

- **Parameters**:
  - `email` - The email template to use
  - `placeholderValues` - Optional object mapping placeholder names to replacement values
- **Returns**: Complete mailto URL with encoded parameters
- **Pre-populates**:
  - **To**: `email.targetTo`
  - **Subject**: `email.subject` (with placeholders replaced if values provided)
  - **Body**: `email.emailBody` (with placeholders replaced if values provided)

**Example:**
```typescript
import { generateSendMailto } from './services/emailService';

const email = { /* ... */ };

// Without placeholder replacement
const mailtoBasic = generateSendMailto(email);

// With placeholder replacement
const mailtoPersonalized = generateSendMailto(email, {
  username: "John Smith",
  company: "Acme Corp"
});
// Use in an anchor tag: <a href={mailtoPersonalized}>Send Email</a>
```

---

### `getEmailPlaceholders(email: Email): string[]`

Get all unique placeholders used in an email template.
Checks both subject and body for placeholders.

- **Parameters**:
  - `email` - The email template to analyze
- **Returns**: Array of unique placeholder names (without braces)
- **Format**: Placeholders use `{{name}}` notation

**Example:**
```typescript
import { getEmailPlaceholders } from './services/emailService';

const email = getEmailById('welcome-email');
const placeholders = getEmailPlaceholders(email);
console.log(placeholders); // ["username", "company"]

// Use this to build a form for user input
placeholders.forEach(name => {
  console.log(`Please provide value for: ${name}`);
});
```

---

### `parseZodErrors(error: z.ZodError): string[]`

Parse Zod validation errors into human-readable messages.

- **Parameters**:
  - `error` - The ZodError to parse
- **Returns**: Array of formatted error messages
- **Format**: `{path}: {message}` (e.g., "subject: Email subject is required")

**Example:**
```typescript
import { z } from 'zod';
import { parseZodErrors } from './services/emailService';

try {
  // ... validation code
} catch (error) {
  if (error instanceof z.ZodError) {
    const messages = parseZodErrors(error);
    messages.forEach(msg => console.error(msg));
  }
}
```

---

## Error Handling

All service functions follow the same error handling pattern:

1. **Catch ZodError specifically** using `error instanceof z.ZodError`
2. **Log with structured data** including method name and validation errors
3. **Throw user-friendly error** with generic message (don't expose raw validation errors)

**Example Pattern:**
```typescript
try {
  const validatedData = EmailSchema.parse(data);
  return validatedData;
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Email validation failed', {
      metadata: { 
        method: 'functionName', 
        validationErrors: error.issues 
      }
    });
    throw new Error('Email data format is invalid');
  }
  throw error;
}
```

---

## Best Practices

1. **Schemas are defined once** at module level and reused (not recreated per validation)
2. **Array validation** is done in one operation (not item-by-item in a loop)
3. **URL encoding** is properly handled for mailto links
4. **Type safety** with proper TypeScript types inferred from Zod schemas
5. **Backward compatibility** with both object and array JSON formats
6. **Placeholder personalization** - Use `{{placeholderName}}` notation for dynamic content
7. **Validate placeholders** before sending emails to ensure all required values are provided

## Placeholder Feature

The email service now supports dynamic placeholders for personalizing emails:

- **Syntax**: Use `{{placeholderName}}` in email subjects and bodies
- **Extraction**: Use `getEmailPlaceholders()` to find what placeholders an email needs
- **Replacement**: Pass values to `generateSendMailto()` as second parameter
- **Validation**: Use `validatePlaceholders()` from `placeholderService` before sending

For complete documentation on placeholders, see:
- `PLACEHOLDERS.md` - Comprehensive guide with examples
- `PLACEHOLDER_EXAMPLES.md` - Code examples and UI integration patterns
- `src/services/placeholderService.ts` - Core placeholder utilities
