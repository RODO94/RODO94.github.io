import { z } from 'zod'
import { getEmailById, parseZodErrors } from '../services/emailService'
import { EmailSchema } from '../schemas/email/email.schema'
import { toast } from 'sonner'

/**
 * Custom hook to load a single email by ID.
 * Provides loading states and error handling.
 * Uses cached data from loadEmails to avoid redundant validation.
 *
 * @param emailId - The ID of the email to load
 * @returns Object containing email, loading state, and error message
 */
export async function fetchEmailById(emailId: string) {
  try {
    const loadedEmail = getEmailById(emailId)
    const validatedEmail = EmailSchema.parse(loadedEmail)

    if (!loadedEmail) {
      toast.error(`Email with ID "${emailId}" not found, try to refresh`, {
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload(),
        },
      })
    } else {
      toast.error(`Email with ID "${emailId}" not found, try to refresh`, {
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload(),
        },
      })
    }
    return validatedEmail
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = parseZodErrors(err)
      toast.error(`Validation errors: ${errorMessages.join(', ')}`)
      return null
    } else if (err instanceof Error) {
      return null
    } else {
      toast.error('An unknown error occurred while loading email')
      return null
    }
  }
}
