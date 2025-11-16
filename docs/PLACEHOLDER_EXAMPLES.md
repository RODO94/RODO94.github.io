# Placeholder Feature Examples

This document demonstrates the placeholder personalization feature with real examples from the codebase.

## Example 1: Welcome Email with Simple Placeholder

### Email Template (from `emails.json`):
```json
{
  "emailId": "welcome-email",
  "subject": "Welcome to Our Service, {{username}}!",
  "targetTo": "user@example.com",
  "emailBody": "Hi {{username}},\n\nWelcome! We're excited to have you on board.\n\nThank you for signing up!\n\nBest regards,\nThe Team"
}
```

### Code Example:
```typescript
import { getEmailById, generateSendMailto, getEmailPlaceholders } from './services/emailService';

// Load the email template
const email = getEmailById('welcome-email');

// Find what placeholders are needed
const placeholders = getEmailPlaceholders(email);
console.log(placeholders); // ["username"]

// Generate mailto link without personalization
const mailtoBasic = generateSendMailto(email);
// Result: mailto:user@example.com?subject=Welcome%20to%20Our%20Service%2C%20%7B%7Busername%7D%7D!&body=Hi%20%7B%7Busername%7D%7D...

// Generate mailto link with personalization
const mailtoPersonalized = generateSendMailto(email, {
  username: "John Smith"
});
// Result: mailto:user@example.com?subject=Welcome%20to%20Our%20Service%2C%20John%20Smith!&body=Hi%20John%20Smith...
```

### Result:
**Before personalization:**
- Subject: `Welcome to Our Service, {{username}}!`
- Body: `Hi {{username}},...`

**After personalization with `{ username: "John Smith" }`:**
- Subject: `Welcome to Our Service, John Smith!`
- Body: `Hi John Smith,...`

---

## Example 2: Follow-up Email with Multiple Placeholders

### Email Template (from `emails.json`):
```json
{
  "emailId": "follow-up",
  "subject": "Following Up on Your Inquiry",
  "targetTo": "client@example.com",
  "emailBody": "Dear {{username}},\n\nThank you for your recent inquiry about {{topic}}.\n\nWe'll get back to you soon with more information.\n\nBest regards,\nSupport Team"
}
```

### Code Example:
```typescript
import { getEmailById, generateSendMailto, getEmailPlaceholders } from './services/emailService';
import { validatePlaceholders } from './services/placeholderService';

const email = getEmailById('follow-up');

// Check what placeholders are needed
const placeholders = getEmailPlaceholders(email);
console.log(placeholders); // ["username", "topic"]

// Validate before sending
const values = { username: "Sarah Johnson", topic: "API integration" };
const validation = validatePlaceholders(email.emailBody, values);

if (validation.isValid) {
  const mailto = generateSendMailto(email, values);
  console.log('Ready to send!');
} else {
  console.log('Missing:', validation.missingPlaceholders);
}
```

### Result:
**After personalization with `{ username: "Sarah Johnson", topic: "API integration" }`:**
- Subject: `Following Up on Your Inquiry`
- Body: `Dear Sarah Johnson,\n\nThank you for your recent inquiry about API integration.\n\nWe'll get back to you soon with more information.\n\nBest regards,\nSupport Team`

---

## Example 3: Meeting Invitation with Many Placeholders

### Email Template (from `emails.json`):
```json
{
  "emailId": "meeting-invitation",
  "subject": "Meeting Invitation: {{meetingTopic}}",
  "targetTo": "colleague@example.com",
  "emailBody": "Hi {{username}},\n\nYou're invited to a meeting about {{meetingTopic}}.\n\nDate: {{meetingDate}}\nTime: {{meetingTime}}\nLocation: {{location}}\n\nPlease confirm your attendance.\n\nBest regards,\n{{organizer}}"
}
```

### Code Example:
```typescript
import { getEmailById, generateSendMailto, getEmailPlaceholders } from './services/emailService';
import { validatePlaceholders, getPlaceholderDescriptions } from './services/placeholderService';

const email = getEmailById('meeting-invitation');

// Get detailed placeholder information
const descriptions = getPlaceholderDescriptions(email.emailBody);
descriptions.forEach(({ name, display }) => {
  console.log(`Please provide: ${display}`);
});

// Output:
// Please provide: {{username}}
// Please provide: {{meetingTopic}}
// Please provide: {{meetingDate}}
// Please provide: {{meetingTime}}
// Please provide: {{location}}
// Please provide: {{organizer}}

// Provide all values
const values = {
  username: "Alex",
  meetingTopic: "Q1 Planning Session",
  meetingDate: "January 25, 2025",
  meetingTime: "2:00 PM - 3:30 PM",
  location: "Conference Room B",
  organizer: "Michael Chen"
};

// Validate first
const validation = validatePlaceholders(email.emailBody, values);
console.log('Valid:', validation.isValid); // true

// Generate personalized mailto
const mailto = generateSendMailto(email, values);
```

### Result:
**After personalization:**
- Subject: `Meeting Invitation: Q1 Planning Session`
- Body:
  ```
  Hi Alex,

  You're invited to a meeting about Q1 Planning Session.

  Date: January 25, 2025
  Time: 2:00 PM - 3:30 PM
  Location: Conference Room B

  Please confirm your attendance.

  Best regards,
  Michael Chen
  ```

---

## Example 4: Handling Missing Placeholders

### Code Example:
```typescript
import { validatePlaceholders } from './services/placeholderService';

const emailBody = "Hi {{username}}, welcome to {{company}}!";

// Case 1: All values provided
const allValues = { username: "John", company: "Acme Corp" };
const validation1 = validatePlaceholders(emailBody, allValues);
console.log(validation1);
// { isValid: true, missingPlaceholders: [] }

// Case 2: Missing some values
const partialValues = { username: "John" };
const validation2 = validatePlaceholders(emailBody, partialValues);
console.log(validation2);
// { isValid: false, missingPlaceholders: ["company"] }

// Case 3: No values provided
const noValues = {};
const validation3 = validatePlaceholders(emailBody, noValues);
console.log(validation3);
// { isValid: false, missingPlaceholders: ["username", "company"] }
```

---

## Example 5: Placeholder Options

### Code Example:
```typescript
import { replacePlaceholders } from './services/placeholderService';

const text = "Hello {{username}}, welcome to {{company}}!";
const values = { username: "Jane" }; // company is missing

// Option 1: Keep unmatched placeholders (default)
const result1 = replacePlaceholders(text, values, { keepUnmatched: true });
console.log(result1);
// "Hello Jane, welcome to {{company}}!"

// Option 2: Remove unmatched placeholders
const result2 = replacePlaceholders(text, values, { keepUnmatched: false });
console.log(result2);
// "Hello Jane, welcome to !"
```

---

## Example 6: UI Integration - React Form Component

### Code Example:
```tsx
import { useState, useEffect } from 'react';
import { getEmailById, generateSendMailto, getEmailPlaceholders } from './services/emailService';
import { validatePlaceholders } from './services/placeholderService';

function PersonalizedEmailForm({ emailId }) {
  const [email, setEmail] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const loadedEmail = getEmailById(emailId);
    setEmail(loadedEmail);
    
    const requiredPlaceholders = getEmailPlaceholders(loadedEmail);
    setPlaceholders(requiredPlaceholders);
    
    // Initialize values
    const initialValues = {};
    requiredPlaceholders.forEach(p => {
      initialValues[p] = '';
    });
    setValues(initialValues);
  }, [emailId]);

  const handleInputChange = (placeholder, value) => {
    setValues(prev => ({
      ...prev,
      [placeholder]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const validation = validatePlaceholders(email.emailBody, values);
    
    if (!validation.isValid) {
      setErrors(validation.missingPlaceholders);
      alert(`Please fill in: ${validation.missingPlaceholders.join(', ')}`);
      return;
    }
    
    // Generate mailto link
    const mailtoLink = generateSendMailto(email, values);
    
    // Open email client
    window.location.href = mailtoLink;
  };

  if (!email) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{email.subject}</h2>
      
      {placeholders.map(placeholder => (
        <div key={placeholder}>
          <label>
            {placeholder}
            {errors.includes(placeholder) && <span style={{color: 'red'}}> *</span>}
          </label>
          <input
            type="text"
            value={values[placeholder] || ''}
            onChange={(e) => handleInputChange(placeholder, e.target.value)}
            required
          />
        </div>
      ))}
      
      <button type="submit">Send Email</button>
      
      <div>
        <h3>Preview:</h3>
        <p><strong>Subject:</strong> {email.subject}</p>
        <pre>{email.emailBody}</pre>
      </div>
    </form>
  );
}

export default PersonalizedEmailForm;
```

---

## Testing the Feature

### Manual Testing Steps:

1. **Load an email with placeholders:**
   ```typescript
   import { getEmailById } from './services/emailService';
   const email = getEmailById('welcome-email');
   console.log(email.emailBody);
   // Should show: "Hi {{username}}..."
   ```

2. **Extract placeholders:**
   ```typescript
   import { getEmailPlaceholders } from './services/emailService';
   const placeholders = getEmailPlaceholders(email);
   console.log(placeholders);
   // Should show: ["username"]
   ```

3. **Replace placeholders:**
   ```typescript
   import { generateSendMailto } from './services/emailService';
   const mailto = generateSendMailto(email, { username: "Test User" });
   console.log(decodeURIComponent(mailto));
   // Should show personalized content with "Test User"
   ```

4. **Validate placeholders:**
   ```typescript
   import { validatePlaceholders } from './services/placeholderService';
   const validation = validatePlaceholders(email.emailBody, {});
   console.log(validation);
   // Should show: { isValid: false, missingPlaceholders: ["username"] }
   ```

### Expected Behaviors:

✅ Placeholders in format `{{name}}` are recognized  
✅ Multiple placeholders in same text are all found  
✅ Placeholders in both subject and body are detected  
✅ Missing values are identified during validation  
✅ Replacement maintains text formatting (line breaks, etc.)  
✅ URL encoding works correctly in mailto links  
✅ Unmatched placeholders can be kept or removed based on options  

---

## Summary

The placeholder feature is now fully implemented and tested:

- ✅ `placeholderService.ts` - Core utilities for placeholder operations
- ✅ `emailService.ts` - Updated to support placeholders in mailto generation
- ✅ Sample data includes emails with placeholders
- ✅ Comprehensive documentation in `PLACEHOLDERS.md`
- ✅ Build passes successfully
- ✅ Ready for UI integration

### Next Steps:

1. Integrate placeholder input form into the email view route
2. Show placeholder requirements to users in the UI
3. Add placeholder preview functionality
4. Consider adding autocomplete for common placeholder values
