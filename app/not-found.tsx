import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen geometric-pattern">
            <div className="text-center space-y-6 glass-card p-8 rounded-2xl max-w-md">
                <div className="text-8xl font-bold text-gradient">404</div>
                <h2 className="text-xl font-semibold">Halaman tidak ditemukan</h2>
                <p className="text-muted-foreground">
                    Halaman yang kamu cari tidak ada atau telah dipindahkan.
                </p>
                <Button asChild className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
                    <Link href="/challenges">Kembali ke Tantangan</Link>
                </Button>
            </div>
        </div>
    );
}
