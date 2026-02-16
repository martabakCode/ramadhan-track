'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Challenges page error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-4">
            <div className="bg-red-500/10 p-4 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground max-w-[500px]">
                Gagal memuat data tantangan. Kemungkinan terjadi masalah koneksi atau schema database belum update.
            </p>
            <div className="flex gap-4 pt-2">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Halaman
                </Button>
                <Button onClick={() => reset()}>
                    Coba Lagi
                </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-muted rounded text-left font-mono text-xs w-full max-w-2xl overflow-auto">
                    <p className="font-bold text-red-400 mb-2">Error Details:</p>
                    {error.message}
                    {error.digest && <p className="mt-1 text-muted-foreground">Digest: {error.digest}</p>}
                </div>
            )}
        </div>
    );
}
