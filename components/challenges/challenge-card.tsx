'use client';

import { cn } from '@/lib/utils/cn';
import { CHALLENGE_TYPES } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Lock } from 'lucide-react';
import Link from 'next/link';
import type { ChallengeWithProgress, ChallengeType } from '@/types/database';

type Props = {
    challenge: ChallengeWithProgress;
    isCompleted: boolean;
    isToday?: boolean;
    isPast?: boolean;
    isFuture?: boolean;
};

export function ChallengeCard({ challenge, isCompleted, isToday, isPast, isFuture }: Props) {
    const challengeType = CHALLENGE_TYPES[challenge.challenge_type as ChallengeType];

    return (
        <Link href={`/challenges/${challenge.id}`}>
            <Card
                className={cn(
                    'group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer',
                    isToday && !isCompleted && 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10',
                    isCompleted && 'bg-emerald-500/5 border-emerald-500/20',
                    isFuture && !isToday && 'opacity-60',
                    'hover:-translate-y-1 hover:shadow-emerald-500/5'
                )}
            >
                {/* Top type gradient bar */}
                <div className={cn(
                    'h-1 w-full bg-gradient-to-r',
                    challenge.challenge_type === 'quran' && 'from-emerald-500 to-teal-400',
                    challenge.challenge_type === 'hadith' && 'from-amber-500 to-orange-400',
                    challenge.challenge_type === 'habit' && 'from-purple-500 to-indigo-400',
                )} />

                {/* Shimmer effect for today */}
                {isToday && !isCompleted && (
                    <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                )}

                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-3">
                            {/* Type badge + Day */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={cn(
                                    'text-xs',
                                    challenge.challenge_type === 'quran' && 'border-emerald-500/50 text-emerald-400',
                                    challenge.challenge_type === 'hadith' && 'border-amber-500/50 text-amber-400',
                                    challenge.challenge_type === 'habit' && 'border-purple-500/50 text-purple-400',
                                )}>
                                    {challengeType?.icon} {challengeType?.label}
                                </Badge>
                                {isToday && (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                        Hari Ini
                                    </Badge>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className={cn(
                                'font-semibold text-base group-hover:text-emerald-400 transition-colors',
                                isCompleted && 'line-through text-muted-foreground'
                            )}>
                                {challenge.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {challenge.description}
                            </p>

                            {/* Points */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-emerald-400">
                                    +{challenge.reward_points} poin
                                </span>
                            </div>
                        </div>

                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                            {isCompleted ? (
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Check className="h-5 w-5 text-emerald-400" />
                                </div>
                            ) : isFuture ? (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                                    {challengeType?.icon || '📋'}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
