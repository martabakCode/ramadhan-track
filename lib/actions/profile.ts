'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(name: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/profile');
    return { success: true };
}

export async function getStats(userId: string) {
    const supabase = await createClient();

    const [profileRes, progressRes, challengesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_daily_progress').select('*').eq('user_id', userId),
        supabase.from('challenges').select('id'),
    ]);

    const profile = profileRes.data;
    const completedCount = progressRes.data?.length || 0;
    const totalChallenges = challengesRes.data?.length || 30;

    return {
        totalPoints: profile?.total_points || 0,
        currentStreak: profile?.current_streak || 0,
        longestStreak: profile?.longest_streak || 0,
        completedChallenges: completedCount,
        totalChallenges,
        completionRate: totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0,
    };
}
