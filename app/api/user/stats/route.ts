import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [profileRes, progressRes, challengesRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).single(),
            supabase.from('user_daily_progress').select('*').eq('user_id', user.id),
            supabase.from('challenges').select('id'),
        ]);

        const profile = profileRes.data;
        const completedCount = progressRes.data?.length || 0;
        const totalChallenges = challengesRes.data?.length || 30;

        return NextResponse.json({
            success: true,
            data: {
                totalPoints: profile?.total_points || 0,
                currentStreak: profile?.current_streak || 0,
                longestStreak: profile?.longest_streak || 0,
                completedChallenges: completedCount,
                totalChallenges,
                completionRate: totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0,
            },
        });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
