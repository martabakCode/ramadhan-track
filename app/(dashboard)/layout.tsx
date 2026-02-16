import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("DashboardLayout Auth Error:", authError);
            redirect('/login');
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error("DashboardLayout Profile Fetch Error:", profileError);
            // We continue with null profile, hoping Navbar handles it.
        }

        return (
            <div className="min-h-screen flex flex-col">
                <Navbar user={user} profile={profile} />
                <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
                <Footer />
            </div>
        );
    } catch (e) {
        console.error("CRITICAL ERROR IN DASHBOARD LAYOUT:", e);
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-lg">
                    <h2 className="text-xl font-bold text-red-700 mb-2">System Error</h2>
                    <p className="text-red-600">Something went wrong while loading the application layout.</p>
                    <pre className="mt-4 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                        {String(e)}
                    </pre>
                </div>
            </div>
        );
    }
}
