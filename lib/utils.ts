import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueSlug(originalUrl: string): string {
  // Create a hash of the original URL and timestamp
  const timestamp = Date.now().toString();
  const hash = createHash('sha256')
    .update(originalUrl + timestamp)
    .digest('hex')
    .slice(0, 6); // Take first 6 characters of hash
  
  // Combine with nanoid for additional uniqueness
  const nano = nanoid(4);
  
  // Combine and ensure it's less than 10 characters
  return (hash + nano).slice(0, 9);
}

export function formatShortUrl(slug: string, domain: string): string {
  return `${domain}/${slug}`;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
