export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ChallengeType = 'quran' | 'habit' | 'hadith';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          current_streak: number;
          longest_streak: number;
          total_points: number;
          last_success_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          current_streak?: number;
          longest_streak?: number;
          total_points?: number;
          last_success_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          current_streak?: number;
          longest_streak?: number;
          total_points?: number;
          last_success_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hadiths: {
        Row: {
          id: string;
          source: string;
          hadith_number: number;
          arabic_text: string;
          translation: string;
          reference: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          hadith_number: number;
          arabic_text: string;
          translation: string;
          reference: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          hadith_number?: number;
          arabic_text?: string;
          translation?: string;
          reference?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          day_number: number;
          title: string;
          description: string;
          challenge_type: ChallengeType;
          reward_points: number;
          challenge_date: string;
          icon: string;
          tips: string | null;
          surah_number: number | null;
          ayah_start: number | null;
          ayah_end: number | null;
          hadith_id: string | null;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          day_number: number;
          title: string;
          description: string;
          challenge_type: ChallengeType;
          reward_points: number;
          challenge_date: string;
          icon: string;
          tips?: string | null;
          surah_number?: number | null;
          ayah_start?: number | null;
          ayah_end?: number | null;
          hadith_id?: string | null;
          payload?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          day_number?: number;
          title?: string;
          description?: string;
          challenge_type?: ChallengeType;
          reward_points?: number;
          challenge_date?: string;
          icon?: string;
          tips?: string | null;
          surah_number?: number | null;
          ayah_start?: number | null;
          ayah_end?: number | null;
          hadith_id?: string | null;
          payload?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenges_hadith_id_fkey";
            columns: ["hadith_id"];
            isOneToOne: false;
            referencedRelation: "hadiths";
            referencedColumns: ["id"];
          },
        ];
      };
      user_daily_progress: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          completion_date: string;
          completed: boolean;
          points_earned: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
          completion_date: string;
          completed?: boolean;
          points_earned: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          completion_date?: string;
          completed?: boolean;
          points_earned?: number;
          completed_at?: string;
        };
        Relationships: [];
      };
      user_hadith_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          hadith_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hadith_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hadith_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          requirement_type: string;
          requirement_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          requirement_type: string;
          requirement_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          requirement_type?: string;
          requirement_value?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      update_streak: {
        Args: { p_user_id: string };
        Returns: undefined;
      };
      get_leaderboard: {
        Args: { limit_count: number };
        Returns: {
          id: string;
          name: string;
          avatar_url: string | null;
          current_streak: number;
          total_points: number;
          rank: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Hadith = Database['public']['Tables']['hadiths']['Row'];
export type Challenge = Database['public']['Tables']['challenges']['Row'];
export type UserDailyProgress = Database['public']['Tables']['user_daily_progress']['Row'];
export type UserHadithBookmark = Database['public']['Tables']['user_hadith_bookmarks']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type UserBadge = Database['public']['Tables']['user_badges']['Row'];

// Legacy alias for backward compatibility
export type UserChallengeProgress = UserDailyProgress;

export type ChallengeWithProgress = Challenge & {
  user_daily_progress: Pick<UserDailyProgress, 'id' | 'completed_at' | 'completed'>[] | null;
  hadiths?: Hadith | null;
};

export type ChallengeWithHadith = Challenge & {
  hadiths: Hadith | null;
};
