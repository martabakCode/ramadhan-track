'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useStreak(userId: string) {
    const [streak, setStreak] = useState<{
        current: number;
        longest: number;
    }>({ current: 0, longest: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchStreak = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('current_streak, longest_streak')
                .eq('id', userId)
                .single();

            if (data) {
                setStreak({
                    current: data.current_streak,
                    longest: data.longest_streak,
                });
            }
            setLoading(false);
        };

        fetchStreak();

        // Real-time subscription
        const channel = supabase
            .channel(`streak-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`,
                },
                (payload) => {
                    const newData = payload.new as { current_streak: number; longest_streak: number };
                    setStreak({
                        current: newData.current_streak,
                        longest: newData.longest_streak,
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return { streak, loading };
}
