'use client';

import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
    const fire = useCallback((options?: {
        particleCount?: number;
        spread?: number;
        origin?: { x?: number; y?: number };
    }) => {
        confetti({
            particleCount: options?.particleCount || 100,
            spread: options?.spread || 70,
            origin: { y: options?.origin?.y || 0.6, x: options?.origin?.x || 0.5 },
            colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'],
        });
    }, []);

    const celebrate = useCallback(() => {
        fire({ particleCount: 100, spread: 70 });

        setTimeout(() => {
            fire({ particleCount: 50, origin: { x: 0 } });
            fire({ particleCount: 50, origin: { x: 1 } });
        }, 250);
    }, [fire]);

    return { fire, celebrate };
}
