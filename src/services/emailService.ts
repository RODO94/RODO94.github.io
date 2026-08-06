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
 * Format a list of CC addresses for display and for pasting into an email
 * client's CC field. Note that mailto URLs use a different separator - see
 * generateSendMailto.
 * @example
 * formatCcList(['a@example.com', 'b@example.com']) // "a@example.com, b@example.com"
 */
export function formatCcList(addresses: string[]): string {
    return addresses.join(', ')
}

/**
 * Parse a comma-separated string of CC addresses into a trimmed array.
 * Empty entries are discarded, so trailing commas and stray spaces are safe.
 * @example
 * parseCcInput('a@example.com, b@example.com, ') // ["a@example.com", "b@example.com"]
 */
export function parseCcInput(raw: string): string[] {
    return raw
        .split(',')
        .map((address) => address.trim())
        .filter((address) => address.length > 0)
}

/**
 * Percent-encode text for a mailto URL, normalising line breaks to CRLF first.
 *
 * RFC 6068 specifies %0D%0A for a line break. Bare %0A is accepted by some mail
 * apps and silently dropped by others - iOS Gmail collapses a whole template
 * into one unbroken paragraph, while Android Gmail renders it correctly. Tested
 * on the affected device: CRLF works with both a short and a long body, bare LF
 * works with neither.
 */
function encodeMailtoText(text: string): string {
    return encodeURIComponent(text.replace(/\r?\n/g, '\r\n'))
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
    const encodedSubject = encodeMailtoText(subject)
    const encodedBody = encodeMailtoText(body)

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
    placeholderValues: Record<string, string> = {}
): string {
    const to = email.targetTo
    const subject = replacePlaceholders(email.subject, placeholderValues)
    const body = replacePlaceholders(email.emailBody, placeholderValues)

    const params: string[] = []

    // CC addresses are comma-separated with no space, per RFC 6068
    if (email.targetCc?.length) {
        params.push(`cc=${email.targetCc.join(',')}`)
    }

    // Properly encode subject and body for URL
    params.push(`subject=${encodeMailtoText(subject)}`)
    params.push(`body=${encodeMailtoText(body)}`)

    return `mailto:${to}?${params.join('&')}`
}

/**
 * Format an email template as plain text for the clipboard.
 * Includes a recipient header so the CC list survives the copy path, which the
 * body alone would drop.
 * @param email - The email template to format
 * @param placeholderValues - Values to substitute into the subject and body
 */
export function formatEmailForClipboard(
    email: Email,
    placeholderValues: Record<string, string> = {}
): string {
    const subject = replacePlaceholders(email.subject, placeholderValues)
    const body = replacePlaceholders(email.emailBody, placeholderValues)

    const headers = [`To: ${email.targetTo}`]

    if (email.targetCc?.length) {
        headers.push(`Cc: ${formatCcList(email.targetCc)}`)
    }

    headers.push(`Subject: ${subject}`)

    return `${headers.join('\n')}\n\n${body}`
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
