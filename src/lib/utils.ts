import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date as YYYY-MM-DD, locale-independent. */
export function fmtDate(iso: string): string {
  return iso.slice(0, 10);
}

/** Format an ISO timestamp as "MM-DD HH:mm". */
export function fmtDateTime(iso: string): string {
  const d = iso.replace("T", " ");
  return d.slice(5, 16);
}
