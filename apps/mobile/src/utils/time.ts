import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';

/**
 * Returns a human-readable relative time label suitable for chat list timestamps.
 * Examples: "just now", "2m", "3h", "Yesterday", "Mon", "Jan 5"
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return 'just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return 'Yesterday';

  const diffDays = Math.floor(diffSeconds / 86400);
  if (diffDays < 7) return format(date, 'EEE');

  return format(date, 'MMM d');
}

/**
 * Returns a full timestamp string for message details.
 */
export function formatFullTimestamp(isoString: string): string {
  return format(new Date(isoString), 'MMM d, yyyy · h:mm a');
}
