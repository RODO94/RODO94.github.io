/**
 * Service for handling dynamic placeholders in email templates.
 * Supports the {{placeholder}} notation for personalizing emails.
 */

/**
 * Regular expression to match placeholders in the format {{placeholderName}}
 * Matches: {{username}}, {{company}}, {{firstName}}, etc.
 * Does not match: {{ username }} (spaces), {username} (single braces)
 */
const PLACEHOLDER_REGEX = /\{\{([a-zA-Z0-9_]+)\}\}/g

/**
 * Extract all unique placeholders from a text string.
 * @example
 * extractPlaceholders("Hello {{username}}, welcome to {{company}}!")
 * // Returns: ["username", "company"]
 */
export function extractPlaceholders(text: string): string[] {
    const matches = text.matchAll(PLACEHOLDER_REGEX)
    const placeholders = new Set<string>()

    for (const match of matches) {
        if (match[1]) {
            placeholders.add(match[1])
        }
    }

    return Array.from(placeholders)
}

/**
 * Replace placeholders in text with provided values.
 * @example
 * replacePlaceholders(
 *   "Hello {{username}}, welcome to {{company}}!",
 *   { username: "John", company: "Acme Corp" }
 * )
 * // Returns: "Hello John, welcome to Acme Corp!"
 */
export function replacePlaceholders(
    text: string,
    values: Record<string, string>,
    options: { keepUnmatched?: boolean } = {}
): string {
    const { keepUnmatched = true } = options

    return text.replace(PLACEHOLDER_REGEX, (match, placeholderName) => {
        const value = values[placeholderName]

        if (value !== undefined) {
            return value
        }

        // If no value provided, either keep the placeholder or replace with empty string
        return keepUnmatched ? match : ''
    })
}

/**
 * Validate that all placeholders in text have corresponding values.
 * @example
 * validatePlaceholders("Hello {{username}}", { username: "John" })
 * // Returns: { isValid: true, missingPlaceholders: [] }
 *
 * validatePlaceholders("Hello {{username}}", {})
 * // Returns: { isValid: false, missingPlaceholders: ["username"] }
 */
export function validatePlaceholders(
    text: string,
    values: Record<string, string>
): { isValid: boolean; missingPlaceholders: string[] } {
    const placeholders = extractPlaceholders(text)
    const missingPlaceholders = placeholders.filter(
        (placeholder) =>
            values[placeholder] === undefined || values[placeholder] === ''
    )

    return {
        isValid: missingPlaceholders.length === 0,
        missingPlaceholders,
    }
}

/**
 * Check if a text contains any placeholders.
 * @example
 * hasPlaceholders("Hello {{username}}") // true
 * hasPlaceholders("Hello world") // false
 */
export function hasPlaceholders(text: string): boolean {
    return PLACEHOLDER_REGEX.test(text)
}

/**
 * Get a formatted description of placeholders in text.
 * Useful for UI to show users what values they need to provide.
 * @example
 * getPlaceholderDescriptions("Hello {{username}} from {{company}}")
 * // Returns: [
 * //   { name: "username", display: "{{username}}" },
 * //   { name: "company", display: "{{company}}" }
 * // ]
 */
export function getPlaceholderDescriptions(text: string): Array<{
    name: string
    display: string
}> {
    const placeholders = extractPlaceholders(text)
    return placeholders.map((name) => ({
        name,
        display: `{{${name}}}`,
    }))
}
