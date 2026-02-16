import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy, Target, BarChart3 } from 'lucide-react';
import type { UserStats } from '@/types/api';

type Props = {
    stats: UserStats;
};

export function StatsOverview({ stats }: Props) {
    const statItems = [
        {
            label: 'Total Poin',
            value: stats.totalPoints.toLocaleString(),
            icon: <Trophy className="h-5 w-5" />,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
        },
        {
            label: 'Streak Saat Ini',
            value: `${stats.currentStreak} 🔥`,
            icon: <Flame className="h-5 w-5" />,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
        },
        {
            label: 'Streak Terlama',
            value: stats.longestStreak.toString(),
            icon: <Target className="h-5 w-5" />,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
        },
        {
            label: 'Diselesaikan',
            value: `${stats.completedChallenges}/${stats.totalChallenges}`,
            icon: <BarChart3 className="h-5 w-5" />,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((item, index) => (
                <Card key={index} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${item.bg}`}>
                            <span className={item.color}>{item.icon}</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{item.value}</p>
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
