import { TZDate } from "@date-fns/tz";
import { format, set, sub } from "date-fns";

export function formatDateYYMMDDHHmm(date: Date, timeZone = 'Asia/Bangkok'): string {
  const zonedDate = new TZDate(date, timeZone);
  return format(zonedDate, 'yyyy-MM-dd HH:mm');
}

export function lastNDay(date: Date, n: number = 2): Date {
    // Step 2: Subtract 2 days
  const twoDaysAgo = sub(date, { days: n });

  // Step 3: Set time to 00:00:00
  const midnightDate = set(twoDaysAgo, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  return midnightDate;
}