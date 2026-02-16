'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toggleBookmark } from '@/lib/actions/hadiths';
import { toast } from 'sonner';
import type { Hadith } from '@/types/database';

type Props = {
    hadith: Hadith;
    userId: string;
    isBookmarked?: boolean;
};

export function HadithCard({ hadith, userId, isBookmarked: initialBookmarked = false }: Props) {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [isPending, startTransition] = useTransition();

    const handleBookmark = () => {
        startTransition(async () => {
            const result = await toggleBookmark(hadith.id, userId);
            if (result.success) {
                setBookmarked(result.bookmarked ?? false);
                toast.success(result.bookmarked ? 'Hadits dibookmark ⭐' : 'Bookmark dihapus');
            } else {
                toast.error('Gagal', { description: result.error });
            }
        });
    };

    return (
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 overflow-hidden">
            <CardContent className="p-6 space-y-5">
                {/* Arabic Text */}
                <div className="text-center space-y-4">
                    <p
                        className="text-2xl md:text-3xl leading-loose font-arabic text-foreground/90"
                        dir="rtl"
                        lang="ar"
                    >
                        {hadith.arabic_text}
                    </p>

                    {/* Ornamental divider */}
                    <div className="flex items-center gap-3 justify-center">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/30" />
                        <span className="text-amber-400 text-lg">✦</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/30" />
                    </div>
                </div>

                {/* Translation */}
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center italic">
                    &ldquo;{hadith.translation}&rdquo;
                </p>

                {/* Reference */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-amber-400/80 font-medium bg-amber-500/10 px-3 py-1.5 rounded-full">
                        📚 {hadith.reference}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBookmark}
                        disabled={isPending}
                        className={`gap-1.5 transition-all ${bookmarked
                            ? 'text-yellow-400 hover:text-yellow-300'
                            : 'text-muted-foreground hover:text-yellow-400'
                            }`}
                    >
                        <Star
                            className={`h-4 w-4 transition-all ${bookmarked ? 'fill-yellow-400' : ''}`}
                        />
                        {bookmarked ? 'Tersimpan' : 'Bookmark'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
