import { useState, useEffect } from 'react'
import { z } from 'zod'
import {
    loadEmails,
    getEmailById,
    parseZodErrors,
} from '../services/emailService'
import type { Email, EmailsArray } from '../schemas/email/email.schema'

interface UseEmailsResult {
    emails: EmailsArray | null
    loading: boolean
    error: string | null
    refetch: () => void
}

interface UseEmailByIdResult {
    email: Email | null
    loading: boolean
    error: string | null
}

/**
 * Custom hook to load and manage all emails.
 * Provides loading states, error handling, and refetch capability.
 * Schemas are defined once at module level and reused.
 *
 * @returns Object containing emails array, loading state, error message, and refetch function
 */
export function useEmails(): UseEmailsResult {
    const [emails, setEmails] = useState<EmailsArray | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refetchTrigger, setRefetchTrigger] = useState(0)

    useEffect(() => {
        const fetchEmails = async () => {
            setLoading(true)
            setError(null)

            try {
                const loadedEmails = loadEmails()
                setEmails(loadedEmails)
            } catch (err) {
                if (err instanceof z.ZodError) {
                    const errorMessages = parseZodErrors(err)
                    setError(`Validation errors: ${errorMessages.join(', ')}`)
                } else if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError('An unknown error occurred while loading emails')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchEmails()
    }, [refetchTrigger])

    const refetch = () => {
        setRefetchTrigger((prev) => prev + 1)
    }

    return { emails, loading, error, refetch }
}

/**
 * Custom hook to load a single email by ID.
 * Provides loading states and error handling.
 * Uses cached data from loadEmails to avoid redundant validation.
 *
 * @param emailId - The ID of the email to load
 * @returns Object containing email, loading state, and error message
 */
export function useEmailById(emailId: string): UseEmailByIdResult {
    const [email, setEmail] = useState<Email | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEmail = async () => {
            setLoading(true)
            setError(null)

            try {
                const loadedEmail = getEmailById(emailId)
                if (!loadedEmail) {
                    setError(`Email with ID "${emailId}" not found`)
                } else {
                    setEmail(loadedEmail)
                }
            } catch (err) {
                if (err instanceof z.ZodError) {
                    const errorMessages = parseZodErrors(err)
                    setError(`Validation errors: ${errorMessages.join(', ')}`)
                } else if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError('An unknown error occurred while loading email')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchEmail()
    }, [emailId])

    return { email, loading, error }
}
