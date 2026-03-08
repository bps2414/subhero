import { createClient } from '@/utils/supabase/server'
import { Search } from 'lucide-react'
import { NotificationCenter } from '@/components/notification-center'

export async function Header() {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch user's subscriptions for dynamic notifications
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('id, service_name, price, next_billing_date, color_hex')
        .eq('user_id', user.id)

    const displayName = user?.email?.split('@')[0] ?? 'User'
    const initials = displayName.slice(0, 2).toUpperCase()

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-zinc-800/50 bg-[var(--bg-primary)]/80 backdrop-blur-xl">
            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Buscar assinaturas..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-900/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4 ml-4">
                {/* Notifications */}
                <NotificationCenter subscriptions={subscriptions ?? []} />

                {/* User Avatar */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-purple-500/20">
                        {initials}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-white leading-none">{displayName}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Plano Grátis</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
