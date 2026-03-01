import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes using clsx and tailwind-merge.
 * This ensures that conflicting classes (like p-4 and p-2) are properly resolved
 * to the last occurrence, avoiding CSS specificity issues.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to a fixed decimal string (e.g. for displaying scores)
 */
export const formatScore = (score: number | string | null | undefined): string => {
  if (score === null || score === undefined) return '0.0';
  const num = typeof score === 'string' ? parseFloat(score) : score;
  if (isNaN(num)) return '0.0';
  return num.toFixed(1);
};
