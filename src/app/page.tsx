import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-8 text-sm font-medium rounded-full bg-white/5 border border-white/10 text-zinc-300 backdrop-blur-md">
          <span className="flex w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          SubHero MVP is live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Stop losing money to ghost subscriptions.
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          The ultimate financial copilot for your recurring expenses. Track, optimize, and safely split costs with friends—all in one beautiful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center justify-center group"
          >
            Get Started Free
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <a
            href="#features"
            className="px-8 py-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-center"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  )
}
