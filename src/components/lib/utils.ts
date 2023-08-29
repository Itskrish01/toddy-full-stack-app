import { type ClassValue, clsx } from "clsx";
import { isBefore } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDatePassed(dueDate: Date): boolean {
  // Get the current date
  const currentDate = new Date();

  // Check if the due date has passed
  return isBefore(new Date(dueDate), currentDate);
}
