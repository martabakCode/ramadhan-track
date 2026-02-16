'use client';

import { cn } from '@/lib/utils/cn';
import { getStreakEmoji } from '@/lib/utils/streak';

type Props = {
    streak: number;
    className?: string;
};

export function StreakCounter({ streak, className }: Props) {
    return (
        <div
            className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold',
                streak > 0
                    ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-muted text-muted-foreground',
                className
            )}
        >
            <span className="text-base">{getStreakEmoji(streak)}</span>
            <span>{streak}</span>
        </div>
    );
}
