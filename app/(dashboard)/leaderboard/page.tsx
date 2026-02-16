import { createClient } from '@/lib/supabase/server';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { Trophy } from 'lucide-react';

export const revalidate = 30;

export default async function LeaderboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, current_streak, total_points')
        .order('total_points', { ascending: false })
        .limit(10);

    const leaderboardData = (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-2">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="text-muted-foreground">
                    Lihat siapa yang paling konsisten di Ramadhan Challenge
                </p>
            </div>

            <LeaderboardTable initialData={leaderboardData} currentUserId={user.id} />
        </div>
    );
}
