'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { completeChallenge } from '@/lib/actions/challenges';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Confetti } from '@/components/shared/confetti';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Check, Flame, Award } from 'lucide-react';

type Props = {
    challengeId: string;
    userId: string;
};

export function CompleteButton({ challengeId, userId }: Props) {
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);
    const [result, setResult] = useState<{
        streak: number;
        points: number;
    } | null>(null);
    const router = useRouter();

    const handleComplete = () => {
        startTransition(async () => {
            const response = await completeChallenge(challengeId, userId);

            if (response.success) {
                setResult({
                    streak: response.data.streak,
                    points: response.data.pointsEarned,
                });
                setShowSuccess(true);
                router.refresh();
            } else {
                toast.error('Gagal', { description: response.error });
            }
        });
    };

    return (
        <>
            <div className="mt-6">
                <Button
                    onClick={handleComplete}
                    disabled={isPending}
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20 h-12 text-base"
                >
                    {isPending ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Menyimpan...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            Tandai Selesai
                        </div>
                    )}
                </Button>
            </div>

            {/* Success Modal */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md border-emerald-500/20">
                    <Confetti active={showSuccess} />
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center">🎉 Masya Allah!</DialogTitle>
                        <DialogDescription asChild className="space-y-6 pt-4">
                            <div>
                                <div className="text-lg text-center text-foreground">
                                    Tantangan berhasil diselesaikan!
                                </div>

                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Flame className="h-4 w-4 text-orange-400" />
                                            Streak
                                        </div>
                                        <span className="font-bold text-xl text-orange-400">
                                            {result?.streak} 🔥
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Award className="h-4 w-4 text-emerald-400" />
                                            Poin
                                        </div>
                                        <span className="font-bold text-emerald-400">
                                            +{result?.points}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => {
                                        setShowSuccess(false);
                                        router.push('/challenges');
                                    }}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                                >
                                    Kembali ke Tantangan
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
