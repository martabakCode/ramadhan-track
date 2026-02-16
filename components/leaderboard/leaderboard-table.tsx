'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type LeaderboardEntry = {
    id: string;
    name: string;
    avatar_url: string | null;
    current_streak: number;
    total_points: number;
    rank: number;
};

type Props = {
    initialData: LeaderboardEntry[];
    currentUserId: string;
};

export function LeaderboardTable({ initialData, currentUserId }: Props) {
    const [data, setData] = useState(initialData);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('leaderboard-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'user_challenge_progress' },
                () => { fetchLeaderboard(); }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchLeaderboard = async () => {
        const { data: newData } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, current_streak, total_points')
            .order('total_points', { ascending: false })
            .limit(10);

        if (newData) {
            setData(newData.map((entry, index) => ({ ...entry, rank: index + 1 })));
        }
    };

    const getRankDisplay = (rank: number) => {
        if (rank === 1) return <span className="text-2xl">🥇</span>;
        if (rank === 2) return <span className="text-2xl">🥈</span>;
        if (rank === 3) return <span className="text-2xl">🥉</span>;
        return <span className="text-lg font-mono text-muted-foreground">{rank}</span>;
    };

    return (
        <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-16 text-center">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Streak</TableHead>
                        <TableHead className="text-right">Poin</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                Belum ada data leaderboard
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((entry) => (
                            <TableRow
                                key={entry.id}
                                className={entry.id === currentUserId ? 'bg-emerald-500/5' : ''}
                            >
                                <TableCell className="text-center">{getRankDisplay(entry.rank)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={entry.avatar_url || undefined} />
                                            <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs">
                                                {entry.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{entry.name}</span>
                                        {entry.id === currentUserId && (
                                            <Badge variant="secondary" className="text-xs">Kamu</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="text-orange-400 font-medium">{entry.current_streak} 🔥</span>
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    {entry.total_points.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
