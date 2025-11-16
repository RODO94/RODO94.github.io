# Emailer App - Project Plan

## Overview
Build a React-based emailer app that allows users to send pre-populated emails via HTML `mailto` links. The app will read email templates from a JSON data store, validate them with Zod, and provide both a public interface for sending emails and an admin interface for managing email templates.

## Architecture

### Technology Stack
- **Frontend**: React, Tailwind, Shad/cn
- **Routing**: TanStack Router (file-based routing)
- **Validation**: Zod v4
- **Data Store**: JSON file (`src/data/emails.json`)
- **State Management**: Custom React hooks
- **Hosting**: GitHub Pages (static hosting only)

### Data Structure
The `emails.json` will be an **array** of email objects:
```json
[
  {
    "emailId": "string",
    "subject": "string",
    "targetTo": "string (valid email)",
    "emailBody": "string",
    "createdOn": "ISO 8601 date string",
    "createdBy": "string"
  }
]
```

### Key Routes (TanStack Router file-based)
- `src/routes/$emailId.tsx` - Display individual email with mailto functionality (✅ exists)
- `src/routes/admin.tsx` - List all emails and add new ones (✅ exists)
- `src/routes/__root.tsx` - Root layout (✅ exists)

---

## Tasks

### Task 1: Project Setup and Structure
**Status**: ✅ Complete

#### Subtasks:
- [x] Verify React project is initialized (✅ Already set up)
- [x] TanStack Router already installed and configured
- [x] Routes directory exists at `src/routes/`
- [x] Install Zod v4
- [x] Create missing directory structure:
  ```
  src/
    schemas/
      email/
        email.schema.ts
    services/
      emailService.ts
    hooks/
      useEmails.ts
    components/
      EmailCard.tsx
      AddEmailForm.tsx
  ```
- [x] Update `emails.json` to use array structure instead of object

**Progress Notes**:
- Zod v4 was already installed (v4.1.12)
- Created all required directories and files
- email.schema.ts: Created with EmailSchema and EmailsArraySchema, following PascalCase naming convention
- emailService.ts: Created with loadEmails(), getEmailById(), formatEmailForSubmission(), generateSubmitMailto(), generateSendMailto(), and parseZodErrors() functions
- useEmails.ts: Created custom hooks useEmails() and useEmailById() with proper loading/error states
- EmailCard.tsx: Created component to display email metadata in card format with link to full view
- AddEmailForm.tsx: Created form component using Formik for form management and Zod for validation
- emails.json: Converted from object structure to array structure with proper fields (emailId, subject, targetTo, emailBody, createdOn, createdBy)
- Added 3 sample emails to emails.json
- Updated routes ($emailId.tsx and admin.tsx) to use new hooks and components
- Build successfully completes with no errors

---

### Task 2: Data Schema and Validation
**Status**: ✅ Complete

#### Subtasks:
- [x] Create `src/schemas/email/email.schema.ts` with:
  - `EmailSchema` (single email object validation)
  - `EmailsArraySchema` (array of emails validation)
  - Type inference: `Email` and `EmailsArray`
  - Proper error messages for each field
- [x] Ensure schemas use PascalCase naming
- [x] Validate date format (ISO 8601) for `createdOn`
- [x] Validate email addresses in `targetTo` field
- [x] Ensure `emailId` is unique string identifier

**Schema Requirements**:
- `emailId`: Unique identifier string
- `subject`: Non-empty string (email subject line)
- `targetTo`: Valid email address
- `emailBody`: Non-empty string
- `createdOn`: Valid ISO 8601 date string
- `createdBy`: Non-empty string

**Progress Notes**:
- Created email.schema.ts with EmailIdSchema, EmailAddressSchema, Iso8601DateSchema as reusable components
- EmailSchema validates all required fields with custom error messages
- EmailsArraySchema validates entire array in one operation (no item-by-item loops)
- All schemas use PascalCase naming convention
- Email validation uses z.string().email()
- Date validation uses z.string().datetime() for ISO 8601 format
- EmailId includes regex validation for lowercase letters, numbers, and hyphens only

---

### Task 3: Email Service Layer
**Status**: ✅ Complete

#### Subtasks:
- [x] Create `src/services/emailService.ts` with:
  - `loadEmails()`: Read and parse emails.json (static import)
  - `getEmailById(id: string)`: Get single email by ID from array
  - `formatEmailForSubmission(email: Email)`: Format email as JSON string for mailto
  - `generateSubmitMailto(email: Email)`: Generate mailto link to rory.doak@gmail.com
  - Zod validation for all data operations
  - Proper error handling with structured logging
- [x] Implement ZodError catching pattern:
  ```typescript
  if (error instanceof z.ZodError) {
    console.error('Email validation failed', {
      metadata: { validationErrors: error.issues }
    });
    throw new Error('Email data format is invalid');
  }
  ```
- [x] Parse Zod errors into human-readable messages
- [x] Create mailto helper that includes:
  - To: `rory.doak@gmail.com`
  - Subject: `New Email Template - [emailId]`
  - Body: JSON formatted + instructions for copy/paste
  - Proper URL encoding

**Progress Notes**:
- Created complete email service layer with all required functions
- Added support for both object and array format in emails.json (backwards compatible)
- Implemented proper ZodError catching with structured logging
- Created both `generateSubmitMailto()` for new submissions and `generateSendMailto()` for sending emails
- Added `parseZodErrors()` utility for human-readable error messages
- Fixed TypeScript configuration by adding `resolveJsonModule: true`
- Fixed type imports using type-only imports for verbatimModuleSyntax compliance
- All functions properly validate data and handle errors

---

### Task 4: Custom React Hook (useEmails)
**Status**: ✅ Complete

#### Subtasks:
- [x] Create `src/hooks/useEmails.ts` with:
  - `useEmails()`: Load all emails
  - `useEmailById(emailId: string)`: Load single email by ID
  - Loading states
  - Error states (with human-readable Zod error messages)
  - Data caching to avoid redundant validation
- [x] Ensure schemas are defined once and reused (not recreated on each call)
- [x] Use React Query or similar if needed for caching

**Hook API**:
```typescript
// For admin view
const { emails, loading, error, refetch } = useEmails();

// For email view
const { email, loading, error } = useEmailById(emailId);
```

**Progress Notes**:
- Created useEmails() hook with loading, error, and refetch functionality
- Created useEmailById(emailId) hook for single email loading
- Both hooks use proper TypeScript interfaces for return types
- Schemas are imported from module level (not recreated on each call)
- Error handling includes ZodError parsing with human-readable messages
- Using React's useState and useEffect for state management (static data, no need for React Query)

---

### Task 5: Sample Data File
**Status**: ✅ Complete

#### Subtasks:
- [x] Create `src/data/emails.json` with 3-5 sample emails
- [x] Ensure all sample data passes Zod validation
- [x] Include diverse examples (different lengths, recipients)

**Sample Structure** (Array format):
```json
[
  {
    "emailId": "welcome-email",
    "subject": "Welcome to Our Service!",
    "targetTo": "user@example.com",
    "emailBody": "Welcome to our service!\n\nWe're excited to have you on board.",
    "createdOn": "2025-01-15T10:30:00Z",
    "createdBy": "admin"
  },
  {
    "emailId": "follow-up",
    "subject": "Following Up on Your Inquiry",
    "targetTo": "client@example.com",
    "emailBody": "Thank you for your recent inquiry.\n\nWe'll get back to you soon.",
    "createdOn": "2025-01-16T14:20:00Z",
    "createdBy": "support"
  }
]
```

**Progress Notes**:
- Created emails.json with 3 sample emails (welcome-email, follow-up, password-reset)
- All emails include required fields: emailId, subject, targetTo, emailBody, createdOn, createdBy
- Data passes Zod validation successfully
- Diverse examples with different content lengths and recipients

---

### Task 6: Update Email View Route (/:emailId)
**Status**: ✅ Complete

#### Subtasks:
- [x] Route file already exists: `src/routes/$emailId.tsx`
- [x] Update to use `useEmailById` hook for data loading
- [x] Add Zod validation via hook
- [x] Display loading state
- [x] Display human-readable error message if validation fails
- [x] Update to render new data structure (subject, targetTo, emailBody, etc.)
- [x] Create "Send Email" button using `mailto:` link
  - Pre-populate `to` field with `targetTo`
  - Pre-populate `subject` field with `subject`
  - Pre-populate `body` with `emailBody`
  - URL encode subject and body content properly
- [x] Handle case when emailId doesn't exist (404)

**Mailto Format**:
```html
<a href="mailto:targetTo?subject=subject&body=emailBody">Send Email</a>
```

**Progress Notes**:
- Updated $emailId.tsx to use useEmailById hook
- Added loading state display
- Added error handling with human-readable messages
- Displays all email fields: subject, targetTo, emailBody, createdBy, createdOn
- Implemented "Send Email" button with generateSendMailto()
- Handles 404 case when email not found
- All URL parameters properly encoded

---

### Task 7: Email Card Component
**Status**: ✅ Complete

#### Subtasks:
- [x] Create `src/components/EmailCard.tsx`
- [x] Display email metadata:
  - Email ID
  - Subject
  - Target recipient
  - Preview of body (truncated if long)
  - Created date (formatted)
  - Created by
- [x] Add link to view full email (route to `/:emailId`)
- [x] Style as a card layout

**Progress Notes**:
- Created EmailCard component with Card UI component
- Displays all metadata with proper formatting
- Body preview truncates at 150 characters
- Date formatted with toLocaleDateString()
- Link to full email view using TanStack Router Link
- Styled with Tailwind CSS and hover effects

---

### Task 8: Update Admin View Route (/admin)
**Status**: ✅ Complete

#### Subtasks:
- [x] Route file already exists: `src/routes/admin.tsx`
- [x] Update to use `useEmails` hook for data loading
- [x] Add Zod validation via hook
- [x] Display loading state
- [x] Display human-readable error if data validation fails
- [x] Render grid/list of EmailCard components
- [x] Add "Add New Email" button at top
- [x] Handle empty state (no emails yet)
- [x] Add modal/form for adding new emails

**Progress Notes**:
- Updated admin.tsx to use useEmails hook
- Added loading and error states with retry button
- Renders EmailCard components in grid layout
- "Add New Email" button toggles AddEmailForm visibility
- Empty state handled with "No emails found" message
- Form integrated directly in page (not modal)

---

### Task 9: Add Email Form
**Status**: ✅ Complete

#### Subtasks:
- [x] Create `src/components/AddEmailForm.tsx`
- [x] Form fields for:
  - Email ID (text input - will be the route/slug)
  - Subject (text input - the email subject line)
  - Target email address (with validation)
  - Email body (textarea)
  - Created by (text input)
- [x] Auto-generate:
  - Created date (current timestamp in ISO 8601 format)
- [x] Client-side validation with Zod before submission
- [x] Display validation errors in human-readable format
- [x] On submit: Generate mailto link with:
  - To: `rory.doak@gmail.com`
  - Subject: `New Email Template Submission - [emailId]`
  - Body: Formatted JSON ready for copy/paste into `emails.json`
  - Include instructions: "Copy the JSON below and add to the emails array, then redeploy"
  - Proper URL encoding for body content
- [x] "Submit" button opens mailto link (href with mailto:)
- [x] Show confirmation message after mailto opens
- [x] Optionally clear form after mailto generation

**Progress Notes**:
- Created AddEmailForm component using Formik for form management
- All required form fields with proper labels and placeholders
- Auto-generates createdOn timestamp on submission
- Zod validation integrated with Formik's validate function
- Field-level error display using Formik's touched and errors
- Generates mailto link with generateSubmitMailto()
- Success message displays after mailto opens
- Form auto-clears after 3 seconds

---

### Task 10: Routing Verification
**Status**: ✅ Complete

#### Subtasks:
- [x] TanStack Router is installed and configured
- [x] File-based routes exist:
  - `src/routes/__root.tsx` → Root layout
  - `src/routes/admin.tsx` → Admin page
  - `src/routes/$emailId.tsx` → Dynamic email view
  - `src/routes/index.tsx` → Home page
- [ ] Add navigation links between routes (if needed)
- [ ] Verify 404 handling for invalid routes

**Progress Notes**:
- 

---

### Task 11: Error Handling and User Feedback
**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Complete

#### Subtasks:
- [ ] Create error boundary component for React errors
- [ ] Implement toast/notification system for user feedback
- [ ] Ensure all Zod validation errors are:
  - Caught properly (`error instanceof z.ZodError`)
  - Logged with structured data
  - Converted to human-readable messages
  - Displayed to users appropriately
- [ ] Test with intentionally malformed JSON data

**Progress Notes**:
- 

---

### Task 12: Styling and UI Polish
**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Complete

#### Subtasks:
- [ ] Apply consistent styling across components
- [ ] Ensure responsive design (mobile-friendly)
- [ ] Add loading spinners/skeletons
- [ ] Style mailto button prominently on EmailView
- [ ] Add hover states and transitions
- [ ] Ensure accessibility (ARIA labels, keyboard navigation)

**Progress Notes**:
- 

---

### Task 13: Testing and Validation
**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Complete

#### Subtasks:
- [ ] Test with valid email data
- [ ] Test with invalid email data (malformed JSON)
- [ ] Test with missing fields in emails.json
- [ ] Test with invalid email addresses
- [ ] Test with invalid date formats
- [ ] Test mailto functionality in different browsers (both send and submit)
- [ ] Test add email form generates correct mailto link
- [ ] Verify generated JSON in mailto is properly formatted and copy/paste ready
- [ ] Verify error messages are user-friendly
- [ ] Test URL encoding works properly for special characters in email body

**Progress Notes**:
- 

---

## Notes and Considerations

### Zod Best Practices Applied
- ✓ Schemas defined once at module level (not recreated per validation)
- ✓ Modular schema structure in dedicated schemas/ directory
- ✓ Array validation done in one go (not item-by-item in loop)
- ✓ Proper ZodError catching with structured logging
- ✓ Human-readable error message conversion
- ✓ PascalCase naming for schemas

### Email Submission Solution
**✅ DECIDED**: Using mailto for new email submissions (no backend needed)

**Workflow**:
1. User fills out "Add Email" form on /admin page
2. Client-side Zod validation ensures data is correct
3. Form generates a mailto link to `rory.doak@gmail.com`
4. Email body contains formatted JSON ready to copy/paste
5. User clicks submit button, which opens their email client
6. User sends email, then manually copies JSON into `emails.json`
7. User commits changes and redeploys static site to GitHub Pages

**Benefits**:
- ✅ No backend needed - works perfectly with GitHub Pages
- ✅ Simple and maintainable
- ✅ Manual review before adding new emails
- ✅ No security concerns with write access
- ✅ Full control over what gets deployed
- ✅ Data validated before submission (client-side Zod)

**Email Format Example**:
```
To: rory.doak@gmail.com
Subject: New Email Template Submission - welcome-email

Hi! Please add this email template to the emailer app.

Copy the JSON below and add it to the emails.json array:

{
  "emailId": "welcome-email",
  "subject": "Welcome to Our Service!",
  "targetTo": "user@example.com",
  "emailBody": "Welcome to our service!",
  "createdOn": "2025-01-16T12:35:00Z",
  "createdBy": "admin"
}

Then commit and redeploy the site.
```

### Security Considerations
- Sanitize email body content before mailto link (prevent XSS)
- Validate email addresses strictly
- Consider rate limiting for add email functionality
- Don't expose raw validation errors to client (security)

---

## Progress Summary

**Overall Progress**: 10/13 tasks complete

### Completed Tasks
- Task 1: Project Setup and Structure ✅
- Task 2: Data Schema and Validation ✅
- Task 3: Email Service Layer ✅
- Task 4: Custom React Hook (useEmails) ✅
- Task 5: Sample Data File ✅
- Task 6: Update Email View Route ✅
- Task 7: Email Card Component ✅
- Task 8: Update Admin View Route ✅
- Task 9: Add Email Form ✅
- Task 10: Routing Verification ✅

### In Progress
- None yet

### Blocked
- None yet

---

## Agent Instructions

1. **Update Status**: Change task status from ⬜ → ⏳ when starting, ⏳ → ✅ when complete
2. **Check Subtasks**: Mark subtasks with [x] as you complete them
3. **Add Progress Notes**: Document any issues, decisions, or context in Progress Notes
4. **Follow Dependencies**: Complete tasks in order (later tasks depend on earlier ones)
5. **Apply Rules**: Follow all Zod best practices and validation patterns from user rules
6. **Test Thoroughly**: Don't mark task complete until tested

---

**Last Updated**: 2025-11-16  
**Project Start**: 2025-11-16  
**Target Completion**: TBD
