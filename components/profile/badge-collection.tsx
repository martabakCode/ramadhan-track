import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BADGES } from '@/lib/constants';

type Props = {
    earnedBadgeNames: string[];
};

export function BadgeCollection({ earnedBadgeNames }: Props) {
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    🏅 Koleksi Badge
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {BADGES.map((badge, index) => {
                        const isEarned = earnedBadgeNames.includes(badge.name);

                        return (
                            <div
                                key={index}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${isEarned
                                        ? 'border-emerald-500/30 bg-emerald-500/5'
                                        : 'border-border/50 bg-muted/30 opacity-50 grayscale'
                                    }`}
                            >
                                <span className="text-3xl">{badge.icon}</span>
                                <span className="text-sm font-medium text-center">{badge.name}</span>
                                <span className="text-xs text-muted-foreground text-center">{badge.description}</span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
