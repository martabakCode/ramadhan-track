import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    try {
        // 1. Fetch all challenges
        const { data: challenges, error: fetchError } = await supabase
            .from('challenges')
            .select('*')
            .order('day_number', { ascending: true });

        if (fetchError) throw fetchError;
        if (!challenges) throw new Error('No challenges found');

        const updates = [];
        const startDate = new Date('2026-02-18'); // Start date: 18 Feb 2026

        for (const challenge of challenges) {
            // Calculate new date based on day_number
            const challengeDate = new Date(startDate);
            challengeDate.setDate(startDate.getDate() + (challenge.day_number - 1));
            const formattedDate = challengeDate.toISOString().split('T')[0];

            let payload = challenge.payload as any;

            // Update Hadith source if applicable
            if (challenge.challenge_type === 'hadith') {
                // Force switch to 'muslim' source for reliability
                // Day number maps to Hadith number (1-30)
                payload = {
                    ...payload,
                    source: 'muslim',
                    number: challenge.day_number
                };
            }

            updates.push({
                id: challenge.id,
                day_number: challenge.day_number,
                title: challenge.challenge_type === 'hadith'
                    ? `Hadits Muslim No. ${challenge.day_number}`
                    : challenge.title, // Update title for consistency
                description: challenge.description,
                challenge_type: challenge.challenge_type,
                reward_points: challenge.reward_points,
                challenge_date: formattedDate,
                icon: challenge.icon,
                tips: challenge.tips,
                payload: payload
            });
        }

        // 2. Upsert updates
        const { error: upsertError } = await supabase
            .from('challenges')
            .upsert(updates);

        if (upsertError) throw upsertError;

        return NextResponse.json({
            status: 'success',
            message: `Updated ${updates.length} challenges.`,
            startDate: '2026-02-18',
            sampleUpdate: updates[0]
        });

    } catch (e: any) {
        return NextResponse.json({
            status: 'error',
            message: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
