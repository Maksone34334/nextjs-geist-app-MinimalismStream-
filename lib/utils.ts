import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Склейка className-ов с учётом Tailwind-конфликтов.
 *   cn("p-2", condition && "p-4", "text-black")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
