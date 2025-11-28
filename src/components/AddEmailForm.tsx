import { useFormik } from 'formik';
import { z } from 'zod';
import { EmailSchema, type Email } from '../schemas/email/email.schema';
import { generateSubmitMailto } from '../services/emailService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

/**
 * Form for adding a new email template.
 * Uses Formik for form management and Zod for validation.
 * On submit, opens email client with JSON formatted for copy/paste.
 */
export function AddEmailForm() {

  const formik = useFormik({
    initialValues: {
      emailId: '',
      subject: '',
      targetTo: '',
      emailBody: '',
      createdBy: '',
      title: '',
      description: ''
    },
    validate: (values) => {
      // Auto-generate createdOn timestamp
      const emailData = {
        ...values,
        createdOn: new Date().toISOString()
      };

      try {
        EmailSchema.parse(emailData);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.issues.forEach((issue) => {
            const path = issue.path[0] as string;
            if (path !== 'createdOn') {
              errors[path] = issue.message;
            }
          });
          return errors;
        }
        return {};
      }
    },
    onSubmit: (values, { resetForm }) => {

      // Auto-generate createdOn timestamp
      const emailData = {
        ...values,
        createdOn: new Date().toISOString()
      } as Email;

      // Generate mailto link
      const mailtoLink = generateSubmitMailto(emailData);

      // Open mailto link
      window.location.href = mailtoLink;

      // Clear form after short delay
      setTimeout(() => {
        resetForm();
      }, 3000);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-2xl" data-netlify="true" name='admin-form'>
      <Card className='m-2'>
        <CardHeader>
          <CardTitle>Add New Template</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {/* Email ID */}
          <div>
            <Label htmlFor="emailId">
              Template ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="emailId"
              name="emailId"
              type="text"
              value={formik.values.emailId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="welcome-email"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used as the URL route (lowercase, numbers, hyphens only)
            </p>
            {formik.touched.emailId && formik.errors.emailId && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {formik.errors.emailId}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Welcome to Our Service"
              className="mt-1"
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {formik.errors.subject}
              </p>
            )}
          </div>

          {/* Target Email */}
          <div>
            <Label htmlFor="targetTo">
              Target Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="targetTo"
              name="targetTo"
              type="email"
              value={formik.values.targetTo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="user@example.com"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              The recipient who will receive this email template
            </p>
            {formik.touched.targetTo && formik.errors.targetTo && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {formik.errors.targetTo}
              </p>
            )}
          </div>

          {/* Email Body */}
          <div>
            <Label htmlFor="emailBody">
              Email Body <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="emailBody"
              name="emailBody"
              value={formik.values.emailBody}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter the email content here..."
              rows={8}
              className="mt-1"
            />
            {formik.touched.emailBody && formik.errors.emailBody && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {formik.errors.emailBody}
              </p>
            )}
          </div>

          {/* Created By */}
          <div>
            <Label htmlFor="createdBy">
              Created By <span className="text-red-500">*</span>
            </Label>
            <Input
              id="createdBy"
              name="createdBy"
              type="text"
              value={formik.values.createdBy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Your name"
              className="mt-1"
            />
            {formik.touched.createdBy && formik.errors.createdBy && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {formik.errors.createdBy}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="emailId">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="campaign title"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used on the email page as the title
            </p>
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {formik.errors.title}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="emailId">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="campaign description"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used on the page to describe the email
            </p>
            {formik.touched.description && formik.errors.description && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>
        </CardContent>
        <CardAction className='flex flex-col gap-4 p-4'>
          {/* Submit Button */}
          <Button type="submit" variant={"primary"}>
            Submit New Template
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This will open your email client with a pre-filled message to submit the template
          </p>
        </CardAction>
      </Card>
    </form>
  );
}
