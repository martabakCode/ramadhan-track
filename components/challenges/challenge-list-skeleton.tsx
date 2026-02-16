import { Card, CardContent } from '@/components/ui/card';

export function ChallengeListSkeleton() {
    return (
        <div className="space-y-6">
            {/* Today's challenge skeleton */}
            <div>
                <div className="h-7 w-48 bg-muted rounded animate-pulse mb-4" />
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-3">
                                <div className="flex gap-2">
                                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                                    <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                                </div>
                                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="flex justify-between">
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Grid skeleton */}
            <div>
                <div className="h-6 w-36 bg-muted rounded animate-pulse mb-4" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-5">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                                        <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                                    </div>
                                    <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="flex justify-between">
                                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
