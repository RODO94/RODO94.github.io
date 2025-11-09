# Tanstack Router Setup

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing.

## Routes

The application has three main routes:

1. **Home** (`/`) - `src/routes/index.tsx`
   - Lists all available emails from `email.json`
   - Provides links to individual email pages

2. **Emailer Page** (`/:emailId`) - `src/routes/$emailId.tsx`
   - Dynamic route that displays a single email based on the `emailId` parameter
   - Loads content from the `email.json` file using the emailId as a key
   - Shows 404 if the email doesn't exist

3. **Admin Page** (`/admin`) - `src/routes/admin.tsx`
   - Displays the full email JSON database
   - Shows all emails in a formatted list

## File Structure

```
src/
  routes/
    __root.tsx        # Root layout with navigation
    index.tsx         # Home page (/)
    $emailId.tsx      # Dynamic email page (/:emailId)
    admin.tsx         # Admin page (/admin)
  main.tsx            # Router setup
  routeTree.gen.ts    # Auto-generated route tree (do not edit)
email.json            # Email data source
```

## Adding New Routes

To add a new route:

1. Create a new file in `src/routes/` following the naming convention:
   - `about.tsx` → `/about`
   - `settings.tsx` → `/settings`
   - `$userId.tsx` → `/:userId` (dynamic parameter)
   - `posts.$postId.tsx` → `/posts/:postId`

2. Export a route using `createFileRoute`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/your-route')({
  component: YourComponent,
})

function YourComponent() {
  return <div>Your content</div>
}
```

3. The route tree will be automatically regenerated when the dev server is running.

## Email Data

The `email.json` file contains email data structured as:

```json
{
  "emailId": {
    "subject": "Email Subject",
    "sender": "sender@example.com",
    "body": "Email content",
    "createdAt": "ISO date string"
  }
}
```

## Development

Run the dev server:

```bash
pnpm dev
```

The TanStack Router plugin will automatically:
- Generate the route tree (`routeTree.gen.ts`)
- Watch for route file changes
- Provide type-safe routing
