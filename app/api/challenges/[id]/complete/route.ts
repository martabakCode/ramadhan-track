import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
    userId: z.string().uuid(),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { userId } = bodySchema.parse(body);

        if (user.id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const today = new Date().toISOString().split('T')[0];

        // Check duplicate for today
        const { data: existing } = await supabase
            .from('user_daily_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('challenge_id', id)
            .eq('completion_date', today)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: 'Already completed today' }, { status: 409 });
        }

        // Get challenge
        const { data: challenge } = await supabase
            .from('challenges')
            .select('reward_points')
            .eq('id', id)
            .single();

        if (!challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        // Insert progress
        const { error } = await supabase.from('user_daily_progress').insert({
            user_id: userId,
            challenge_id: id,
            points_earned: challenge.reward_points,
            completion_date: today,
            completed: true,
        });

        if (error) {
            return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
        }

        // Update streak
        await supabase.rpc('update_streak', { p_user_id: userId });

        const { data: profile } = await supabase
            .from('profiles')
            .select('current_streak')
            .eq('id', userId)
            .single();

        return NextResponse.json({
            success: true,
            data: {
                streak: profile?.current_streak || 1,
                pointsEarned: challenge.reward_points,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request body', details: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
