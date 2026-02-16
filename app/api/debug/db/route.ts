import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    try {
        // Test query 1: Check if challenges table exists
        const { data: challenges, error: challengesError } = await supabase
            .from('challenges')
            .select('count')
            .limit(1);

        // Test query 2: Check if user_daily_progress table exists
        const { data: progress, error: progressError } = await supabase
            .from('user_daily_progress')
            .select('count')
            .limit(1)
            .maybeSingle(); // Expecting error if table missing

        return NextResponse.json({
            status: 'ok',
            tests: {
                challenges: { exists: !challengesError, error: challengesError },
                user_daily_progress: { exists: !progressError, error: progressError },
            },
            timestamp: new Date().toISOString()
        });
    } catch (e: any) {
        return NextResponse.json({
            status: 'error',
            message: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
