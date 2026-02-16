'use server';

import { createClient } from '@/lib/supabase/server';

export async function getLeaderboard(limit: number = 10) {
    const supabase = await createClient();

    // Try to use the RPC function first, fall back to direct query
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, current_streak, total_points')
        .order('total_points', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Leaderboard error:', error);
        return [];
    }

    return (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));
}
