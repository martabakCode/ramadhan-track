import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(dateString: string): string {
    const date = parseISO(dateString);

    if (isToday(date)) {
        return 'Hari ini';
    }

    if (isYesterday(date)) {
        return 'Kemarin';
    }

    return format(date, 'd MMMM yyyy', { locale: id });
}

export function formatRelativeTime(dateString: string): string {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: id });
}

export function getDayNumber(startDate: string, currentDate: string): number {
    const start = parseISO(startDate);
    const current = parseISO(currentDate);
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
}

export function getTodayISO(): string {
    return new Date().toISOString().split('T')[0];
}
