'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

type Props = {
    active: boolean;
};

export function Confetti({ active }: Props) {
    const fire = useCallback(() => {
        // Stars
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'],
        });

        // Side cannons
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#10b981', '#06b6d4', '#f59e0b'],
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#10b981', '#06b6d4', '#f59e0b'],
            });
        }, 250);
    }, []);

    useEffect(() => {
        if (active) {
            fire();
        }
    }, [active, fire]);

    return null;
}
