import { z } from 'zod'
import { EmailSchema, EmailsArraySchema } from '../schemas/email/email.schema'
import type { Email, EmailsArray } from '../schemas/email/email.schema'
import emailsData from '../data/emails.json'
import { replacePlaceholders, extractPlaceholders } from './placeholderService'

/**
 * Load and validate all emails from the JSON data store.
 */
export function loadEmails(): EmailsArray {
    try {
        // Convert object format to array format if needed
        let emailsArray: unknown

        if (Array.isArray(emailsData)) {
            emailsArray = emailsData
        } else {
            // If data is in object format, convert to array
            emailsArray = Object.entries(emailsData).map(([id, data]) => {
                if (typeof data === 'object' && data !== null) {
                    return {
                        emailId: id,
                        ...data,
                    }
                }
                return data
            })
        }

        // Validate the entire array in one operation
        const validatedEmails = EmailsArraySchema.parse(emailsArray)
        return validatedEmails
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Email validation failed', {
                metadata: {
                    method: 'loadEmails',
                    validationErrors: error.issues,
                },
            })
            throw new Error(
                'Email data format is invalid, check the emails.json file'
            )
        }
        throw error
    }
}

/**
 * Get a single email by its ID from the array of emails.
 */
export function getEmailById(id: string): Email {
    try {
        const emails = loadEmails()
        const email = emails.find((e) => e.emailId === id)

        if (!email) {
            throw new Error(`Email with ID "${id}" not found`)
        }

        // Re-validate the single email for extra safety
        const validatedEmail = EmailSchema.parse(email)
        return validatedEmail
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Email validation failed', {
                metadata: {
                    method: 'getEmailById',
                    emailId: id,
                    validationErrors: error.issues,
                },
            })
            throw new Error(
                'Email data format is invalid, check the emails.json file'
            )
        }
        throw error
    }
}

/**
 * Format an email object as a JSON string for submission.
 */
export function formatEmailForSubmission(email: Email): string {
    return JSON.stringify(email, null, 2)
}

/**
 * Generate a mailto link for submitting a new email template to rory.doak@gmail.com.
 * The email body contains formatted JSON ready for copy/paste into emails.json.
 * @param email - The email template to submit
 * @returns Complete mailto URL with encoded parameters
 */
export function generateSubmitMailto(email: Email): string {
    const to = 'rory.doak@gmail.com'
    const subject = `New Email Template Submission - ${email.emailId}`

    const body = `Hi! Please add this email template to the emailer app.

Copy the JSON below and add it to the emails.json array:

${formatEmailForSubmission(email)}
`

    // Properly encode subject and body for URL
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)

    return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`
}

/**
 * Generate a mailto link for sending an email using the template.
 * Pre-populates the recipient, subject, and body fields.
 * Supports placeholder replacement for personalization.
 * @example
 * // Without placeholders
 * generateSendMailto(email)
 *
 * // With placeholders
 * generateSendMailto(email, { username: "John", company: "Acme" })
 */
export function generateSendMailto(
    email: Email,
    placeholderValues?: Record<string, string>
): string {
    const to = email.targetTo
    const subject = email.subject
    let body = email.emailBody

    // Replace placeholders if values are provided
    if (placeholderValues) {
        body = replacePlaceholders(body, placeholderValues)
        // Also support placeholders in subject
        const subjectWithPlaceholders = replacePlaceholders(
            subject,
            placeholderValues
        )
        const encodedSubject = encodeURIComponent(subjectWithPlaceholders)
        const encodedBody = encodeURIComponent(body)
        return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`
    }

    // Properly encode subject and body for URL
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)

    return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`
}

/**
 * Get all placeholders used in an email template.
 * Checks both subject and body for placeholders.
 * @example
 * getEmailPlaceholders(email) // Returns: ["username", "company"]
 */
export function getEmailPlaceholders(email: Email): string[] {
    const subjectPlaceholders = extractPlaceholders(email.subject)
    const bodyPlaceholders = extractPlaceholders(email.emailBody)

    // Combine and deduplicate
    const allPlaceholders = new Set([
        ...subjectPlaceholders,
        ...bodyPlaceholders,
    ])
    return Array.from(allPlaceholders)
}

/**
 * Parse Zod validation errors into human-readable messages.
 */
export function parseZodErrors(error: z.ZodError): string[] {
    return error.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'data'
        return `${path}: ${issue.message}`
    })
}
