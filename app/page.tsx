import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME, CHALLENGE_CATEGORIES } from '@/lib/constants';
import { Sparkles, Target, Trophy, Users, ArrowRight, Star, Flame } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center geometric-pattern">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-[10%] text-7xl animate-float opacity-20">🌙</div>
        <div className="absolute top-40 right-[15%] text-5xl animate-float opacity-15" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-40 left-[20%] text-6xl animate-float opacity-10" style={{ animationDelay: '3s' }}>🕌</div>
        <div className="absolute bottom-20 right-[10%] text-4xl animate-float opacity-15" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute top-1/3 left-[5%] text-3xl animate-float opacity-10" style={{ animationDelay: '4s' }}>🌟</div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>Ramadhan 1447 H / 2026</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-gradient">30 Hari</span>
              <span className="block mt-2">Tantangan</span>
              <span className="block mt-2 text-gradient">Ramadhan</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tingkatkan ibadah Ramadhanmu dengan tantangan harian yang menyenangkan.
              Track streak, kumpulkan poin, raih badge, dan bersaing di leaderboard!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/25 px-8 h-12 text-base gap-2 transition-all hover:shadow-emerald-500/40 hover:scale-105"
                >
                  Mulai Tantangan
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border/50 hover:bg-accent/50">
                  Sudah Punya Akun
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <span>30 Tantangan</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>6+ Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-emerald-400" />
                <span>Leaderboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-500/[0.02] to-background" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur <span className="text-gradient">Unggulan</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Semua yang kamu butuhkan untuk menjalani Ramadhan yang produktif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: 'Tantangan Harian',
                description: 'Tantangan baru setiap hari selama 30 hari Ramadhan, mencakup ibadah, quran, sedekah, dan lainnya.',
                gradient: 'from-emerald-500/20 to-emerald-500/5',
                iconColor: 'text-emerald-400',
              },
              {
                icon: <Flame className="h-8 w-8" />,
                title: 'Streak Tracking',
                description: 'Pertahankan streak harianmu! Semakin konsisten, semakin besar rewardnya.',
                gradient: 'from-orange-500/20 to-orange-500/5',
                iconColor: 'text-orange-400',
              },
              {
                icon: <Trophy className="h-8 w-8" />,
                title: 'Badge & Poin',
                description: 'Kumpulkan badge dan poin dari setiap tantangan yang diselesaikan.',
                gradient: 'from-yellow-500/20 to-yellow-500/5',
                iconColor: 'text-yellow-400',
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Leaderboard',
                description: 'Bersaing secara sehat dengan teman-teman dan lihat siapa yang paling konsisten.',
                gradient: 'from-cyan-500/20 to-cyan-500/5',
                iconColor: 'text-cyan-400',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 space-y-4">
                  <div className={`${feature.iconColor}`}>{feature.icon}</div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kategori <span className="text-gradient">Tantangan</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Beragam tantangan untuk meningkatkan kualitas ibadah
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {Object.values(CHALLENGE_CATEGORIES).map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/30 p-6 hover:bg-card/60 transition-all hover:scale-105 cursor-default"
              >
                <span className="text-4xl">{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-8 glass-card rounded-3xl p-12">
            <div className="text-6xl">🌙</div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Siap Memulai <span className="text-gradient">Perjalananmu?</span>
            </h2>
            <p className="text-muted-foreground">
              Bergabung sekarang dan jadikan Ramadhan tahun ini yang terbaik!
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/25 px-8 h-12 text-base gap-2 transition-all hover:shadow-emerald-500/40 hover:scale-105"
              >
                Daftar Gratis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 {APP_NAME}. Ramadhan Kareem 🌟</p>
        </div>
      </footer>
    </div>
  );
}
