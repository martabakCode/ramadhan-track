import { CHALLENGE_TYPES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/date';
import { Calendar, Award, BookOpen, Lightbulb, PlayCircle } from 'lucide-react';
import type { Challenge, ChallengeType } from '@/types/database';
import type { QuranSurah, HadithData } from '@/lib/services/api';

type Props = {
    challenge: Challenge;
    quranData: QuranSurah | null;
    hadithData: HadithData | null;
};

export function ChallengeDetail({ challenge, quranData, hadithData }: Props) {
    const challengeType = CHALLENGE_TYPES[challenge.challenge_type as ChallengeType];
    const payload = (challenge as any).payload;

    const getSunnahUrl = (source: string, number: number) => {
        const map: Record<string, string> = {
            'arbain-nawawi': 'nawawi40',
            'bukhari': 'bukhari',
            'muslim': 'muslim',
            'abu-daud': 'abudawud',
            'tirmidzi': 'tirmidhi',
            'nasai': 'nasai',
            'ibnu-majah': 'ibnmajah',
            'malik': 'malik',
            'ahmad': 'ahmad', // check validity
            'darimi': 'darimi'
        };
        const book = map[source] || source;
        return `https://sunnah.com/${book}/${number}`;
    };

    return (
        <Card className="border-border/50 overflow-hidden shadow-sm">
            {/* Header gradient based on type */}
            <div className={cn(
                'h-32 flex items-center justify-center bg-gradient-to-br',
                challenge.challenge_type === 'quran' && 'from-emerald-500/20 via-teal-500/10 to-cyan-500/10',
                challenge.challenge_type === 'hadith' && 'from-amber-500/20 via-orange-500/10 to-yellow-500/10',
                challenge.challenge_type === 'habit' && 'from-purple-500/20 via-indigo-500/10 to-blue-500/10',
            )}>
                <span className="text-6xl animate-pulse-slow">{challengeType?.icon || '📋'}</span>
            </div>

            <CardHeader className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={cn(
                        'font-mono',
                        challenge.challenge_type === 'quran' && 'border-emerald-500/50 text-emerald-400',
                        challenge.challenge_type === 'hadith' && 'border-amber-500/50 text-amber-400',
                        challenge.challenge_type === 'habit' && 'border-purple-500/50 text-purple-400',
                    )}>
                        {challengeType?.icon} {challengeType?.label}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                        Hari {challenge.day_number}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Award className="h-3 w-3" />
                        {challenge.reward_points} poin
                    </Badge>
                </div>

                <CardTitle className="text-2xl">{challenge.title}</CardTitle>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {formatDate(challenge.challenge_date)}
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-6">
                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <BookOpen className="h-4 w-4 text-emerald-400" />
                        Deskripsi
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        {challenge.description}
                    </p>
                </div>

                {/* API Content Extraction */}

                {/* QURAN CONTENT */}
                {challenge.challenge_type === 'quran' && quranData && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <span className="text-emerald-500">📖</span>
                                {quranData.namaLatin} ({quranData.arti})
                            </h3>
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                {quranData.jumlahAyat} Ayat
                            </span>
                        </div>

                        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 p-4 space-y-4">
                            {/* Intro / First Verse */}
                            {quranData.ayat && quranData.ayat.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 font-bold text-xs shrink-0">
                                            {quranData.ayat[0].nomorAyat}
                                        </div>
                                        <p className="text-right font-arabic text-2xl leading-loose w-full" dir="rtl">
                                            {quranData.ayat[0].teksArab}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">
                                        {quranData.ayat[0].teksIndonesia}
                                    </p>
                                </div>
                            )}

                            <div className="pt-2 text-center">
                                <a
                                    href={`https://quran.com/${quranData.nomor}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-500 hover:text-emerald-600 text-sm font-medium inline-flex items-center gap-1"
                                >
                                    Baca Selengkapnya di Quran.com &rarr;
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* HADITH CONTENT */}
                {challenge.challenge_type === 'hadith' && hadithData && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            📜 Hadits Hari Ini
                        </div>
                        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30 p-6 space-y-6">
                            {/* Arabic */}
                            <p
                                className="text-xl md:text-2xl leading-loose text-center font-arabic text-foreground/90"
                                dir="rtl"
                                lang="ar"
                            >
                                {hadithData.arab}
                            </p>

                            {/* Divider */}
                            <div className="flex items-center gap-3 justify-center opacity-50">
                                <div className="h-px w-12 bg-amber-500" />
                                <span className="text-amber-500">✦</span>
                                <div className="h-px w-12 bg-amber-500" />
                            </div>

                            {/* Translation */}
                            <p className="text-base text-muted-foreground leading-relaxed text-justify">
                                {hadithData.id}
                            </p>

                            {/* Reference */}
                            <div className="text-center">
                                <span className="text-xs text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full dark:bg-amber-900 dark:text-amber-300">
                                    HR. {payload?.source?.toUpperCase() || 'Unknown'} No. {hadithData.number}
                                </span>
                            </div>

                            <div className="pt-2 text-center">
                                <a
                                    href={getSunnahUrl(payload?.source, hadithData.number)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-500 hover:text-amber-600 text-sm font-medium inline-flex items-center gap-1"
                                >
                                    Baca Selengkapnya di Sunnah.com &rarr;
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fallback for failed Hadith/Quran Load */}
                {challenge.challenge_type === 'hadith' && !hadithData && (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-center space-y-2">
                        <p className="font-semibold text-destructive">Gagal Memuat Konten Hadits</p>
                        <p className="text-sm text-muted-foreground">
                            Terjadi kesalahan saat mengambil data dari sumber eksternal.
                            Silakan cek koneksi internet Anda atau coba lagi nanti.
                        </p>
                    </div>
                )}
                {challenge.challenge_type === 'quran' && !quranData && (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-center space-y-2">
                        <p className="font-semibold text-destructive">Gagal Memuat Konten Qur'an</p>
                        <p className="text-sm text-muted-foreground">
                            Mohon maaf, konten ayat belum dapat ditampilkan saat ini.
                        </p>
                    </div>
                )}

                {/* Tips */}
                {challenge.tips && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Lightbulb className="h-4 w-4 text-yellow-400" />
                            Tips
                        </div>
                        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4">
                            <p className="text-sm text-muted-foreground">{challenge.tips}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card >
    );
}
