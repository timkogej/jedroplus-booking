import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate end time from start time and duration
 * @param startTime - Start time in "HH:MM" format
 * @param durationMinutes - Duration in minutes
 * @returns End time in "HH:MM" format
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

/**
 * Format time range from start time and duration
 * @param startTime - Start time in "HH:MM" format
 * @param durationMinutes - Duration in minutes
 * @returns Formatted time range like "12:00 - 13:00"
 */
export function formatTimeRange(startTime: string, durationMinutes: number): string {
  const endTime = calculateEndTime(startTime, durationMinutes);
  return `${startTime} - ${endTime}`;
}
