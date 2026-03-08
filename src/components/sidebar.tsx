'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Plus,
    Bell,
    Settings,
    Zap,
    LogOut,
    CreditCard,
    TrendingDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNav = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Subscriptions', href: '/dashboard/subscriptions', icon: CreditCard },
    { label: 'Add New', href: '/dashboard/add', icon: Plus },
    { label: 'Insights', href: '/dashboard/insights', icon: TrendingDown },
]

const secondaryNav = [
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="glass-sidebar fixed top-0 left-0 z-40 h-screen w-[var(--sidebar-width)] flex flex-col py-6 px-4">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 px-3 mb-10 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                    Sub<span className="text-purple-400">Hero</span>
                </span>
            </Link>

            {/* Main Nav */}
            <nav className="flex-1 flex flex-col gap-1">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Menu
                </p>
                {mainNav.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-white/[0.08] text-white shadow-sm'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'w-[18px] h-[18px] flex-shrink-0',
                                    isActive ? 'text-purple-400' : 'text-zinc-500'
                                )}
                            />
                            {item.label}
                            {item.label === 'Add New' && (
                                <span className="ml-auto text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                                    NEW
                                </span>
                            )}
                        </Link>
                    )
                })}

                {/* Divider */}
                <div className="my-4 mx-3 h-px bg-zinc-800/60" />

                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    System
                </p>
                {secondaryNav.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-white/[0.08] text-white shadow-sm'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'w-[18px] h-[18px] flex-shrink-0',
                                    isActive ? 'text-purple-400' : 'text-zinc-500'
                                )}
                            />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom: Logout */}
            <div className="pt-4 border-t border-zinc-800/60">
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all w-full"
                    >
                        <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    )
}
