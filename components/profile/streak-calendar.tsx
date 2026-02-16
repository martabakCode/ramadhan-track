import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

type Props = {
    completionDates: string[];
    totalDays?: number;
};

export function StreakCalendar({ completionDates, totalDays = 30 }: Props) {
    const completedSet = new Set(completionDates);
    const today = new Date().toISOString().split('T')[0];

    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    📅 Kalender Tantangan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                    {Array.from({ length: totalDays }, (_, i) => {
                        const day = i + 1;
                        // Use a simple approach: check if day is completed based on completionDates
                        const isCompleted = completionDates.some((d) => {
                            const date = new Date(d);
                            return !isNaN(date.getTime());
                        }) && i < completionDates.length;

                        return (
                            <div
                                key={day}
                                className={cn(
                                    'aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all',
                                    isCompleted
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-muted/50 text-muted-foreground border border-border/50'
                                )}
                                title={`Hari ${day}`}
                            >
                                {isCompleted ? '✓' : day}
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                        Selesai
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-muted/50 border border-border/50" />
                        Belum Selesai
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
