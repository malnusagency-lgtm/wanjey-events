import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${fileDMatch[1]}`;
  }
  const idMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${idMatch[1]}`;
  }

  // CDN Cache-control rewrite for R2 urls to bypass rate limiting without a custom domain
  if (cleanUrl.includes('.r2.dev/')) {
    const parts = cleanUrl.split('.r2.dev/');
    if (parts.length === 2) {
      return `/api/media/download?key=${encodeURIComponent(parts[1])}`;
    }
  }
  return cleanUrl;
}
