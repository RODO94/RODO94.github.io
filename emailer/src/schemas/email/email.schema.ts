import { z } from 'zod';

/**
 * Schema for validating a single email template object.
 * Ensures all fields are present and properly formatted.
 */
export const EmailSchema = z.object({
  emailId: z
    .string()
    .min(1, 'Email ID is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Email ID must contain only lowercase letters, numbers, and hyphens'
    ),
  subject: z
    .string()
    .min(1, 'Email subject is required')
    .max(200, 'Email subject must be 200 characters or less'),
  targetTo: z
    .string()
    .email('Must be a valid email address'),
  emailBody: z
    .string()
    .min(1, 'Email body is required'),
  createdOn: z
    .string()
    .datetime({ message: 'Must be a valid ISO 8601 date string' }),
  createdBy: z
    .string()
    .min(1, 'Creator name is required')
});

/**
 * Schema for validating an array of email templates.
 * Validates the entire array in one operation (not item-by-item).
 */
export const EmailsArraySchema = z.array(EmailSchema);

/**
 * Type inference for a single email template
 */
export type Email = z.infer<typeof EmailSchema>;

/**
 * Type inference for an array of email templates
 */
export type EmailsArray = z.infer<typeof EmailsArraySchema>;
