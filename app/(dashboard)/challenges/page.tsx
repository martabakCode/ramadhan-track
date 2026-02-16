import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChallengeWithProgress } from '@/types/database';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function ChallengesPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch challenges with user progress
    const { data: challenges, error } = await supabase
        .from('challenges')
        .select(`
            *,
            user_daily_progress (
                id,
                completed_at,
                completed
            )
        `)
        .order('day_number', { ascending: true });

    if (error) {
        console.error('Error fetching challenges:', error);
        return (
            <div className="p-4 text-center text-red-500">
                Gagal memuat tantangan. Silakan coba lagi nanti.
            </div>
        );
    }

    const typedChallenges = (challenges || []) as unknown as ChallengeWithProgress[];

    // Group challenges by day
    const challengesByDay = typedChallenges.reduce((acc, challenge) => {
        const day = challenge.day_number;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(challenge);
        return acc;
    }, {} as Record<number, ChallengeWithProgress[]>);

    // Get today's day number (approximate based on start date or just use Day 1 for demo)
    // For now, let's assume Day 1 is today for the user to see relevant content.
    // Ideally, we calculate this based on Ramadhan start date.
    // Let's highlight the first incomplete day or Day 1.
    const todayDayNumber = 1;

    return (
        <div className="space-y-8 pb-20">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Tantangan Harian</h1>
                <p className="text-muted-foreground">
                    Selesaikan tantangan setiap hari untuk membangun kebiasaan baik Ramadhan.
                </p>
            </header>

            <div className="space-y-12">
                {Object.entries(challengesByDay)
                    .sort(([dayA], [dayB]) => Number(dayA) - Number(dayB))
                    .map(([dayStr, dayChallenges]) => {
                        const dayNumber = Number(dayStr);
                        const isDayComplete = dayChallenges.every(c =>
                            c.user_daily_progress &&
                            c.user_daily_progress.length > 0 &&
                            c.user_daily_progress[0].completed
                        );

                        // Check if previous days are completed to lock future days?
                        // For now, let's keep all unlocked or logic simple.
                        const isLocked = false; // logic to lock future days

                        return (
                            <section key={dayNumber} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xl border border-emerald-500/20">
                                        {dayNumber}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold flex items-center gap-2">
                                            Hari ke-{dayNumber}
                                            {isDayComplete && (
                                                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                                                    Selesai
                                                </span>
                                            )}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {dayChallenges.length} Tantangan
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {dayChallenges.map((challenge) => {
                                        const isCompleted = !!(
                                            challenge.user_daily_progress &&
                                            challenge.user_daily_progress.length > 0 &&
                                            challenge.user_daily_progress[0].completed
                                        );

                                        return (
                                            <ChallengeCard
                                                key={challenge.id}
                                                challenge={challenge}
                                                isCompleted={isCompleted}
                                                isToday={dayNumber === todayDayNumber}
                                                isFuture={false}
                                                isPast={dayNumber < todayDayNumber}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
            </div>
        </div>
    );
}
