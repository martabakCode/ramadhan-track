export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center geometric-pattern relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
            <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🌙</div>
            <div className="absolute bottom-20 right-10 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>⭐</div>
            <div className="absolute top-1/2 left-1/4 text-4xl opacity-5 animate-float" style={{ animationDelay: '4s' }}>🕌</div>

            <div className="relative z-10 w-full max-w-md mx-auto px-4">
                {children}
            </div>
        </div>
    );
}
