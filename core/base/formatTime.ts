/**
 * Formats the given time in seconds into a human-readable format (HH:MM:SS).
 *
 * @param seconds - The time duration in seconds.
 * @returns A string representing the formatted time (HHh MMm SSs).
 */
export default function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "00h 00m 00s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
}
