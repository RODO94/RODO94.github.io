import { Link } from '@tanstack/react-router';
import { Card } from './ui/card';
import type { Email } from '../schemas/email/email.schema';

interface EmailCardProps {
  email: Email;
}

/**
 * Display an email template in a card format.
 * Shows metadata and preview with link to full email view.
 */
export function EmailCard({ email }: EmailCardProps) {
  // Format the date for display
  const formattedDate = new Date(email.createdOn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Truncate body if too long
  const bodyPreview = email.emailBody.length > 150 
    ? `${email.emailBody.substring(0, 150)}...` 
    : email.emailBody;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        {/* Email ID and Subject */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {email.subject}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {email.emailId}
          </p>
        </div>

        {/* Target recipient */}
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            To: 
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {email.targetTo}
          </span>
        </div>

        {/* Body preview */}
        <div className="text-sm text-gray-700 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
          {bodyPreview}
        </div>

        {/* Metadata footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Created by: {email.createdBy}</p>
            <p>{formattedDate}</p>
          </div>

          {/* Link to full email view */}
          <Link
            to="/$emailId"
            params={{ emailId: email.emailId }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View Full Email →
          </Link>
        </div>
      </div>
    </Card>
  );
}
