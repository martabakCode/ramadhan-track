'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('App error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 geometric-pattern">
            <div className="text-center space-y-6 max-w-md glass-card p-8 rounded-2xl">
                <div className="text-6xl">😔</div>
                <h2 className="text-2xl font-bold">Oops! Terjadi Kesalahan</h2>
                <p className="text-muted-foreground">
                    {error.message || 'Sesuatu yang tidak terduga terjadi'}
                </p>
                <Button
                    onClick={reset}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                >
                    Coba Lagi
                </Button>
            </div>
        </div>
    );
}
