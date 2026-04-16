/**
 * Resolve --since flag to a date string that git understands.
 * Supports:
 *   - "yesterday"         → "yesterday"
 *   - "1week" / "2weeks"  → "1 week ago" / "2 weeks ago"
 *   - "3days"             → "3 days ago"
 *   - "2024-01-15"        → "2024-01-15" (ISO date, passed through)
 */
export function resolveSince(since: string): string {
  if (since === 'yesterday') return 'yesterday';

  // Ndays  e.g. "3days", "1day"
  const daysMatch = since.match(/^(\d+)\s*days?$/i);
  if (daysMatch) {
    const n = parseInt(daysMatch[1], 10);
    return `${n} day${n === 1 ? '' : 's'} ago`;
  }

  // Nweeks  e.g. "1week", "2weeks"
  const weeksMatch = since.match(/^(\d+)\s*weeks?$/i);
  if (weeksMatch) {
    const n = parseInt(weeksMatch[1], 10);
    return `${n} week${n === 1 ? '' : 's'} ago`;
  }

  // Nmonths  e.g. "1month", "2months"
  const monthsMatch = since.match(/^(\d+)\s*months?$/i);
  if (monthsMatch) {
    const n = parseInt(monthsMatch[1], 10);
    return `${n} month${n === 1 ? '' : 's'} ago`;
  }

  // ISO date e.g. "2024-01-15" – pass through unchanged
  if (/^\d{4}-\d{2}-\d{2}$/.test(since)) return since;

  // Fallback – let git parse it
  return since;
}
