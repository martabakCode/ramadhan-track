import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, current_streak, total_points')
            .order('total_points', { ascending: false })
            .limit(10);

        const leaderboard = (data || []).map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        return NextResponse.json({ success: true, data: leaderboard });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
