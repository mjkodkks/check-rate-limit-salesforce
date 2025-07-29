import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

export function formatDateYYMMDDHHmm(date: Date, timeZone = 'Asia/Bangkok'): string {
  const zonedDate = new TZDate(date, timeZone);
  return format(zonedDate, 'yyyy-MM-dd HH:mm');
}