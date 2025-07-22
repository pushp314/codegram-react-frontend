// =============== src/lib/utils.ts ===============
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

/**
 * Combines multiple class names into a single string, resolving conflicts.
 * Useful for conditionally applying Tailwind CSS classes.
 * @param inputs - A list of class names.
 * @returns A single string of combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a relative time string (e.g., "5 minutes ago").
 * @param dateString - The ISO date string to format.
 * @returns A formatted relative time string.
 */
export function formatRelativeTime(dateString: string) {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
        console.error("Invalid date string for formatting:", dateString);
        return "Invalid date";
    }
}
