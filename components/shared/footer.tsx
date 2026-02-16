import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🌙</span>
                        <span className="font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            {APP_NAME}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/challenges" className="hover:text-foreground transition-colors">
                            Tantangan
                        </Link>
                        <Link href="/leaderboard" className="hover:text-foreground transition-colors">
                            Leaderboard
                        </Link>
                        <Link href="/profile" className="hover:text-foreground transition-colors">
                            Profil
                        </Link>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-1">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} {APP_NAME}. Ramadhan Kareem 🌟
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 font-mono hover:text-emerald-500 transition-colors cursor-default">
                            Made by MartabakCode
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
