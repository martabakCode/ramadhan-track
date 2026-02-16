'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleBookmark(hadithId: string, userId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
        return { success: false, error: 'Unauthorized' };
    }

    // Check if already bookmarked
    const { data: existing } = await supabase
        .from('user_hadith_bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('hadith_id', hadithId)
        .single();

    if (existing) {
        // Remove bookmark
        const { error } = await supabase
            .from('user_hadith_bookmarks')
            .delete()
            .eq('id', existing.id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/challenges');
        return { success: true, bookmarked: false };
    } else {
        // Add bookmark
        const { error } = await supabase
            .from('user_hadith_bookmarks')
            .insert({
                user_id: userId,
                hadith_id: hadithId,
            });

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/challenges');
        return { success: true, bookmarked: true };
    }
}

export async function getBookmarkedHadiths(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('user_hadith_bookmarks')
        .select(`
            id,
            created_at,
            hadiths (
                id,
                source,
                hadith_number,
                arabic_text,
                translation,
                reference,
                category
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Get bookmarks error:', error);
        return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
}
