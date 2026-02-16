import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
                <div className="text-4xl animate-float">🌙</div>
                <LoadingSpinner size="lg" />
                <p className="text-sm text-muted-foreground">Memuat...</p>
            </div>
        </div>
    );
}
