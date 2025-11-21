# Add Email Template Edit Feature

## Problem Statement

Currently, users can submit new email templates through the admin page, but once submitted, there is no way to edit existing templates. Users need the ability to modify templates after submission, following the same mailto-based workflow as template creation.

## Current State Overview

**Architecture**: Frontend-only React app using TanStack Router and Vite

**Data Storage**: Email templates stored in `src/data/emails.json` (manually updated by developer)

**Submission Flow**: Forms generate mailto links to rory.doak@gmail.com with JSON data for manual addition to emails.json

**Key Components**:
* `admin.tsx` (src/routes): Admin page showing template list and add form
* `AddEmailForm.tsx`: Formik-based form with Zod validation for new templates
* `EmailCard.tsx`: Displays template preview in admin list
* `emailService.ts`: Contains `generateSubmitMailto()` for new template submission
* `email.schema.ts`: Zod schema validation (EmailSchema)

## Proposed Changes

### 1. Create EditEmailForm Component (src/components/EditEmailForm.tsx)

**Purpose**: Reusable form component for editing existing email templates

**Key Features**:
* Accepts an `email` prop (Email type) to pre-populate form fields
* Uses Formik for form management, identical structure to AddEmailForm
* Uses EmailSchema for validation
* Generates mailto link via new `generateEditMailto()` service function
* Includes an `onCancel` callback prop for closing the form

**Implementation Notes**:
* Reuse same field structure as AddEmailForm but with `initialValues` set from email prop
* All fields remain editable (emailId, subject, targetTo, emailBody, createdBy, title, description)
* Update `createdOn` timestamp on submission to track last edit
* Follow modular schema patterns from rules (reuse EmailSchema)

### 2. Update EmailCard Component (src/components/EmailCard.tsx)

**Add**: "Edit Template" button/link alongside existing "View Email" link

**Props Addition**: Add `onEdit` callback prop that accepts the email object

**UI Update**: Add edit action button in the card footer next to "View Email" link

### 3. Update Admin Page State Management (src/routes/admin.tsx)

**State Additions**:
* `editingEmail: Email | null` - tracks which email is being edited
* `showEditForm: boolean` - controls edit form visibility

**Behavior**:
* When user clicks edit on EmailCard, set `editingEmail` to that email and show EditEmailForm
* Hide AddEmailForm when EditEmailForm is visible (only one form at a time)
* Pass `onCancel` callback to EditEmailForm to close it

**UI Updates**:
* Render EditEmailForm when editingEmail is not null
* Update "Submit New Template" button to be disabled/hidden when editing

### 4. Add Edit Submission Service Function (src/services/emailService.ts)

**Function**: `generateEditMailto(originalEmail: Email, updatedEmail: Email): string`

**Purpose**: Generate mailto link for submitting template edits

**Email Content**:
* Subject: `Email Template Edit - ${emailId}`
* Body includes:
    * Original template JSON (for reference)
    * Updated template JSON (for copy/paste)
    * Clear instructions for developer to replace in emails.json

**Validation**: Validate updatedEmail with EmailSchema before generating mailto

### 5. Update Email Schema Handling

**No schema changes needed** - EditEmailForm reuses existing EmailSchema

**Validation approach**: Follow existing pattern from AddEmailForm (catch ZodError, map to field errors)

**Performance**: Schema defined at module level and reused per rules

## Implementation Checklist

### Agent 1: Create EditEmailForm Component
* Create `src/components/EditEmailForm.tsx`
* Implement Formik form with email prop for initial values
* Add Zod validation using EmailSchema
* Integrate with `generateEditMailto()` service function
* Add onCancel callback functionality
* Test form validation and mailto generation

### Agent 2: Integrate Edit Feature into Admin Page
* Add `generateEditMailto()` function to `src/services/emailService.ts`
* Update `src/components/EmailCard.tsx` to add edit button with onEdit callback
* Update `src/routes/admin.tsx` to manage edit state (editingEmail, showEditForm)
* Add EditEmailForm rendering logic in admin.tsx
* Ensure only one form (Add or Edit) is visible at a time
* Test complete edit workflow from admin page
