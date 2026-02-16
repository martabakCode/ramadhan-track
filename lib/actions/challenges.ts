'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const completeChallengeSchema = z.object({
    challengeId: z.string().uuid(),
    userId: z.string().uuid(),
});

export type CompleteChallengeResult =
    | { success: true; data: { streak: number; pointsEarned: number } }
    | { success: false; error: string };

export async function completeChallenge(
    challengeId: string,
    userId: string
): Promise<CompleteChallengeResult> {
    try {
        const validated = completeChallengeSchema.parse({ challengeId, userId });
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.id !== validated.userId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Check if already completed today
        const today = new Date().toISOString().split('T')[0];
        const { data: existing } = await supabase
            .from('user_daily_progress')
            .select('id')
            .eq('user_id', validated.userId)
            .eq('challenge_id', validated.challengeId)
            .eq('completion_date', today)
            .single();

        if (existing) {
            return { success: false, error: 'Tantangan sudah diselesaikan hari ini' };
        }

        // Get challenge details
        const { data: challenge } = await supabase
            .from('challenges')
            .select('reward_points')
            .eq('id', validated.challengeId)
            .single();

        if (!challenge) {
            return { success: false, error: 'Tantangan tidak ditemukan' };
        }

        // Insert progress
        const { error: insertError } = await supabase
            .from('user_daily_progress')
            .insert({
                user_id: validated.userId,
                challenge_id: validated.challengeId,
                points_earned: challenge.reward_points,
                completion_date: today,
                completed: true,
            });

        if (insertError) {
            console.error('Insert error:', insertError);
            return { success: false, error: 'Gagal menyimpan progress' };
        }

        // Update streak via DB function
        const { error: streakError } = await supabase.rpc('update_streak', {
            p_user_id: validated.userId,
        });

        if (streakError) {
            console.error('Streak update error:', streakError);
        }

        // Get updated profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('current_streak')
            .eq('id', validated.userId)
            .single();

        revalidatePath('/challenges');
        revalidatePath('/profile');
        revalidatePath('/leaderboard');

        return {
            success: true,
            data: {
                streak: profile?.current_streak || 1,
                pointsEarned: challenge.reward_points,
            },
        };
    } catch (error) {
        console.error('Complete challenge error:', error);

        if (error instanceof z.ZodError) {
            return { success: false, error: 'Input tidak valid' };
        }

        return { success: false, error: 'Terjadi kesalahan' };
    }
}

export async function resetStreak(userId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ current_streak: 0 })
        .eq('id', userId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/profile');
    return { success: true };
}
