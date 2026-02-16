import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ChallengeDetail } from '@/components/challenges/challenge-detail';
import { CompleteButton } from '@/components/challenges/complete-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { QuranAPI, HadithAPI, QuranSurah, HadithData } from '@/lib/services/api';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ChallengePage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    // Fetch challenge without joining hadiths table (we use API now)
    const { data: challenge, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !challenge) {
        notFound();
    }

    // Fetch API Data based on payload
    let quranData: QuranSurah | null = null;
    let hadithData: HadithData | null = null;

    const payload = (challenge as any).payload;

    if (challenge.challenge_type === 'quran' && payload?.juz) {
        // Fetch the first surah of the Juz as a representative
        const { startSurah } = QuranAPI.getJuzInfo(payload.juz);
        quranData = await QuranAPI.getSurah(startSurah);
    } else if (challenge.challenge_type === 'hadith' && payload?.source && payload?.number) {
        hadithData = await HadithAPI.getHadith(payload.source, payload.number);
    } else if (challenge.challenge_type === 'hadith') {
        // Fallback or debug log if payload is missing
        console.warn(`[ChallengePage] Hadith payload missing source or number: ${JSON.stringify(payload)}`);
    }

    // Check progress
    const today = new Date().toISOString().split('T')[0];
    const { data: progress } = await supabase
        .from('user_daily_progress')
        .select('id, points_earned')
        .eq('user_id', user.id)
        .eq('challenge_id', id)
        .eq('completion_date', today)
        .single();

    const isCompleted = !!progress;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {/* Back button */}
            <Link href="/challenges">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Tantangan
                </Button>
            </Link>

            <ChallengeDetail
                challenge={challenge}
                quranData={quranData}
                hadithData={hadithData}
            />

            {isCompleted ? (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
                        <Check className="h-5 w-5" />
                        Tantangan Sudah Diselesaikan
                    </div>
                    <p className="text-sm text-muted-foreground">
                        +{progress.points_earned} poin diperoleh
                    </p>
                </div>
            ) : (
                <CompleteButton challengeId={challenge.id} userId={user.id} />
            )}
        </div>
    );
}
