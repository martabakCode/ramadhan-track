'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type SupabaseContext = {
    supabase: SupabaseClient<Database>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                // Refresh to clear any server-side state
                window.location.href = '/login';
            } else if (event === 'SIGNED_IN') {
                // thorough check to avoid loop, but middleware handles this mostly.
                // router.refresh() is safer than window.location.href
                // But for now, let's just NOT do anything if we are already in the app.
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider');
    }
    return context;
};
