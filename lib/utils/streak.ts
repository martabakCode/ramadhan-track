export function calculateStreak(
    completionDates: string[],
    today: string
): { current: number; longest: number } {
    if (completionDates.length === 0) {
        return { current: 0, longest: 0 };
    }

    // Sort dates in ascending order
    const sorted = [...completionDates].sort();

    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < sorted.length; i++) {
        const prevDate = new Date(sorted[i - 1]);
        const currDate = new Date(sorted[i]);
        const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            tempStreak++;
        } else if (diffDays > 1) {
            tempStreak = 1;
        }
        // diffDays === 0 means duplicate date, skip

        longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Check if current streak is active (last completion is today or yesterday)
    const lastDate = new Date(sorted[sorted.length - 1]);
    const todayDate = new Date(today);
    const daysSinceLast = (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLast <= 1) {
        currentStreak = tempStreak;
    } else {
        currentStreak = 0;
    }

    return { current: currentStreak, longest: longestStreak };
}

export function getStreakEmoji(streak: number): string {
    if (streak >= 30) return '🏆';
    if (streak >= 20) return '💎';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '✨';
    return '🌱';
}

export function getStreakMessage(streak: number): string {
    if (streak >= 30) return 'Masya Allah! Kamu menyelesaikan semua tantangan!';
    if (streak >= 20) return 'Luar biasa! Terus pertahankan!';
    if (streak >= 14) return 'Hebat! 2 minggu berturut-turut!';
    if (streak >= 7) return 'Keren! 1 minggu konsisten!';
    if (streak >= 3) return 'Bagus! Terus semangat!';
    if (streak >= 1) return 'Awal yang baik! Yuk lanjutkan!';
    return 'Mulai tantangan pertamamu hari ini!';
}
