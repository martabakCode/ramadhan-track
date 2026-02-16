'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard Error Boundary Caught:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-6">
            <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan!</h2>
            <p className="text-muted-foreground">
                Maaf, terjadi kesalahan saat memuat halaman dashboard.
            </p>
            {process.env.NODE_ENV === 'development' && (
                <div className="p-4 bg-red-50 text-red-800 rounded text-left text-xs font-mono max-w-lg overflow-auto">
                    {error.message}
                    {error.digest && <div className="mt-1 opacity-50">Digest: {error.digest}</div>}
                </div>
            )}
            <Button onClick={() => reset()}>Coba Lagi</Button>
        </div>
    );
}
