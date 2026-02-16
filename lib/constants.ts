export const APP_NAME = 'Ramadhan Companion';
export const APP_DESCRIPTION = 'Qur\'an 📖 + Habit Tracker ✅ + Murojaah Hadits 📜 + Streak 🔥';

export const CHALLENGE_TYPES = {
    quran: { label: "Qur'an", icon: '📖', color: 'emerald', gradient: 'from-emerald-500/20 to-teal-500/10' },
    hadith: { label: 'Hadits', icon: '📜', color: 'amber', gradient: 'from-amber-500/20 to-orange-500/10' },
    habit: { label: 'Habit', icon: '🕌', color: 'purple', gradient: 'from-purple-500/20 to-indigo-500/10' },
} as const;

export const CHALLENGE_CATEGORIES = {
    ibadah: { label: 'Ibadah', icon: '🕌', color: 'emerald' },
    quran: { label: "Qur'an", icon: '📖', color: 'cyan' },
    doa: { label: 'Doa', icon: '🤲', color: 'purple' },
    sedekah: { label: 'Sedekah', icon: '💝', color: 'pink' },
    akhlak: { label: 'Akhlak', icon: '🤝', color: 'blue' },
    puasa: { label: 'Puasa', icon: '🌙', color: 'indigo' },
    ilmu: { label: 'Ilmu', icon: '📚', color: 'amber' },
    kesehatan: { label: 'Kesehatan', icon: '💪', color: 'green' },
    hadith: { label: 'Hadits', icon: '📜', color: 'orange' },
} as const;

export const DIFFICULTY_CONFIG = {
    easy: { label: 'Mudah', color: 'bg-green-100 text-green-800', points: 10 },
    medium: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-800', points: 20 },
    hard: { label: 'Sulit', color: 'bg-red-100 text-red-800', points: 30 },
} as const;

export const BADGES = [
    { name: 'Pemula', description: 'Selesaikan tantangan pertama', icon: '🌟', requirement_type: 'completion' as const, requirement_value: 1 },
    { name: '📖 7 Hari Qur\'an', description: 'Baca Qur\'an 7 hari berturut-turut', icon: '📖', requirement_type: 'quran_streak' as const, requirement_value: 7 },
    { name: '📜 7 Hari Hadits', description: 'Murojaah hadits 7 hari berturut-turut', icon: '📜', requirement_type: 'hadith_streak' as const, requirement_value: 7 },
    { name: '🔥 Konsisten', description: 'Streak 7 hari berturut-turut', icon: '🔥', requirement_type: 'streak' as const, requirement_value: 7 },
    { name: '⭐ Tekun', description: 'Streak 14 hari berturut-turut', icon: '⭐', requirement_type: 'streak' as const, requirement_value: 14 },
    { name: '💎 Istiqomah', description: 'Streak 21 hari berturut-turut', icon: '💎', requirement_type: 'streak' as const, requirement_value: 21 },
    { name: '🏆 Juara Ramadhan', description: '30 hari perfect Ramadhan', icon: '🏆', requirement_type: 'streak' as const, requirement_value: 30 },
    { name: '💰 Dermawan', description: 'Kumpulkan 500 poin', icon: '💰', requirement_type: 'points' as const, requirement_value: 500 },
] as const;
