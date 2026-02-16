import { createClient } from '@/lib/supabase/server';
import { getStats } from '@/lib/actions/profile';
import { StatsOverview } from '@/components/profile/stats-overview';
import { BadgeCollection } from '@/components/profile/badge-collection';
import { StreakCalendar } from '@/components/profile/streak-calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const stats = await getStats(user.id);

    // Get completion dates for calendar
    const { data: progress } = await supabase
        .from('user_daily_progress')
        .select('completion_date')
        .eq('user_id', user.id)
        .order('completion_date', { ascending: true });

    const completionDates = progress?.map((p) => p.completion_date) || [];

    // Get earned badges
    const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_id, badges(name)')
        .eq('user_id', user.id);

    const earnedBadgeNames = userBadges?.map((ub) => {
        const badge = ub.badges as unknown as { name: string } | null;
        return badge?.name || '';
    }).filter(Boolean) || [];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="border-border/50 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-purple-500/20" />
                <CardContent className="pt-0 pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                        <Avatar className="h-24 w-24 ring-4 ring-background">
                            <AvatarImage src={profile?.avatar_url || undefined} />
                            <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-2xl">
                                {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left pb-2">
                            <h1 className="text-2xl font-bold">{profile?.name || 'User'}</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <StatsOverview stats={stats} />

            {/* Progress bar */}
            <Card className="border-border/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress Keseluruhan</span>
                        <span className="text-sm text-emerald-400 font-bold">{stats.completionRate}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {stats.completedChallenges} dari {stats.totalChallenges} tantangan diselesaikan
                    </p>
                </CardContent>
            </Card>

            {/* Calendar */}
            <StreakCalendar completionDates={completionDates} />

            {/* Badges */}
            <BadgeCollection earnedBadgeNames={earnedBadgeNames} />
        </div>
    );
}
