import { format, getTime } from 'date-fns';

export function formatDateYYMMDDHHmmss(date: Date):  string | number {
  return format(date, 'yyyy-MM-dd HH:mm');  
}
