'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Challenge, UserDailyProgress } from '@/types/database';

export function useChallenge(challengeId: string, userId: string) {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [progress, setProgress] = useState<UserDailyProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        const today = new Date().toISOString().split('T')[0];

        const fetchData = async () => {
            const [challengeRes, progressRes] = await Promise.all([
                supabase.from('challenges').select('*').eq('id', challengeId).single(),
                supabase
                    .from('user_daily_progress')
                    .select('*')
                    .eq('challenge_id', challengeId)
                    .eq('user_id', userId)
                    .eq('completion_date', today)
                    .single(),
            ]);

            setChallenge(challengeRes.data);
            setProgress(progressRes.data);
            setLoading(false);
        };

        fetchData();
    }, [challengeId, userId]);

    return {
        challenge,
        progress,
        isCompleted: !!progress,
        loading,
    };
}
