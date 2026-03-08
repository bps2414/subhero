'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, CalendarClock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Subscription {
    id: string
    service_name: string
    price: number
    next_billing_date: string
    color_hex: string
}

interface NotificationCenterProps {
    subscriptions: Subscription[]
}

function getDaysUntil(dateStr: string): number {
    const today = new Date()
    const target = new Date(dateStr)
    // reset time to midnight for boolean math
    today.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    const diff = target.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function NotificationCenter({ subscriptions }: NotificationCenterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Generate notifications based on next billing date (<= 7 days)
    const notifications = subscriptions
        .map(sub => {
            const days = getDaysUntil(sub.next_billing_date)
            return { sub, days }
        })
        .filter(item => item.days <= 7) // Overdue or upcoming within 7 days
        .sort((a, b) => a.days - b.days)

    const unreadCount = notifications.length

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2 rounded-xl border transition-all",
                    isOpen
                        ? "bg-zinc-800 text-white border-zinc-700"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                )}
                aria-label="Notificações"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-[var(--bg-primary)] animate-pulse" />
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl border border-zinc-800/50 overflow-hidden animate-fade-in origin-top-right z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
                        <h3 className="text-sm font-semibold text-white">Notificações</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                                {unreadCount} Novas
                            </span>
                        )}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 flex flex-col items-center justify-center text-center">
                                <Bell className="w-8 h-8 text-zinc-700 mb-2" />
                                <p className="text-sm font-medium text-white mb-1">Tudo em dia!</p>
                                <p className="text-xs text-zinc-500">Nenhuma renovação nos próximos 7 dias.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800/30">
                                {notifications.map(({ sub, days }) => {
                                    const isOverdue = days < 0
                                    const isToday = days === 0

                                    return (
                                        <div key={sub.id} className="p-4 hover:bg-white/[0.02] transition-colors flex gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                style={{
                                                    backgroundColor: sub.color_hex + '20',
                                                    color: sub.color_hex,
                                                }}
                                            >
                                                {isOverdue ? <AlertCircle className="w-5 h-5" /> : <CalendarClock className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-zinc-300 leading-snug">
                                                    <span className="font-semibold text-white">{sub.service_name}</span>
                                                    {' '}
                                                    {isOverdue && 'está atrasada desde '}
                                                    {isToday && 'renova hoje!'}
                                                    {!isOverdue && !isToday && `renova em ${days} ${days === 1 ? 'dia' : 'dias'}.`}
                                                </p>
                                                <p className={cn(
                                                    "text-xs mt-1 font-medium",
                                                    isOverdue ? "text-red-400" : "text-purple-400"
                                                )}>
                                                    R$ {sub.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
