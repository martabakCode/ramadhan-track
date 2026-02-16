export type ApiResponse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};

export type CompleteChallengeResponse = ApiResponse<{
    streak: number;
    pointsEarned: number;
}>;

export type LeaderboardEntry = {
    id: string;
    name: string;
    avatar_url: string | null;
    current_streak: number;
    total_points: number;
    rank: number;
};

export type UserStats = {
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    completedChallenges: number;
    totalChallenges: number;
    completionRate: number;
};
