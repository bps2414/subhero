'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CalendarDays, Pencil, Trash2, Ghost, HandCoins } from 'lucide-react'
import Link from 'next/link'
import { deleteSubscription } from '@/app/dashboard/actions'
import { SplitCostModal } from '@/components/split-cost-modal'

interface Subscription {
    id: string
    service_name: string
    price: number
    billing_cycle: 'monthly' | 'yearly'
    next_billing_date: string
    color_hex: string
    logo_url: string | null
    category: string
}

interface SubscriptionListProps {
    subscriptions: Subscription[]
}

function getDaysUntil(dateStr: string): number {
    const today = new Date()
    const target = new Date(dateStr)
    const diff = target.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

interface SubscriptionRowProps {
    sub: Subscription
    onSplitClick: (sub: Subscription) => void
}

function SubscriptionRow({ sub, onSplitClick }: SubscriptionRowProps) {
    const daysUntil = getDaysUntil(sub.next_billing_date)
    const isUrgent = daysUntil <= 3 && daysUntil >= 0
    const isPast = daysUntil < 0

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all group">
            {/* Service indicator */}
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg"
                style={{
                    backgroundColor: sub.color_hex + '20',
                    color: sub.color_hex,
                    boxShadow: `0 4px 12px ${sub.color_hex}15`,
                }}
            >
                {sub.service_name.slice(0, 2).toUpperCase()}
            </div>

            {/* Name + category */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{sub.service_name}</p>
                <p className="text-xs text-zinc-500">{sub.category}</p>
            </div>

            {/* Next billing */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarDays className="w-3.5 h-3.5" />
                <span
                    className={cn(
                        isPast && 'text-red-400',
                        isUrgent && !isPast && 'text-orange-400'
                    )}
                >
                    {isPast
                        ? 'Atrasado'
                        : daysUntil === 0
                            ? 'Hoje'
                            : daysUntil === 1
                                ? 'Amanhã'
                                : `em ${daysUntil} dias`}
                </span>
            </div>

            {/* Price */}
            <div className="text-right">
                <p className="text-sm font-semibold text-white">{formatCurrency(sub.price)}</p>
                <p className="text-[10px] text-zinc-600">
                    /{sub.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                </p>
            </div>

            {/* Actions: Split + Edit + Delete */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                <button
                    onClick={() => onSplitClick(sub)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-green-400 hover:bg-green-500/[0.08] transition-all"
                    aria-label={`Dividir custo de ${sub.service_name}`}
                >
                    <HandCoins className="w-4 h-4" />
                </button>
                <Link
                    href={`/dashboard/edit/${sub.id}`}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-400 hover:bg-purple-500/[0.08] transition-all"
                    aria-label={`Editar ${sub.service_name}`}
                >
                    <Pencil className="w-4 h-4" />
                </Link>
                <form action={deleteSubscription}>
                    <input type="hidden" name="id" value={sub.id} />
                    <button
                        type="submit"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                        aria-label={`Deletar ${sub.service_name}`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
    const [selectedSplitSub, setSelectedSplitSub] = useState<Subscription | null>(null)

    if (subscriptions.length === 0) {
        return (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
                    <Ghost className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Nada por aqui... ainda</h3>
                <p className="text-sm text-zinc-500 max-w-sm">
                    Você não adicionou nenhuma assinatura. Crie a primeira para começar a acompanhar seus gastos.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="glass-card overflow-hidden animate-fade-in stagger-5">
                {/* List header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/50">
                    <h2 className="text-sm font-semibold text-white">Assinaturas Ativas</h2>
                    <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full">
                        {subscriptions.length} ativas
                    </span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-zinc-800/30">
                    {subscriptions.map((sub) => (
                        <SubscriptionRow
                            key={sub.id}
                            sub={sub}
                            onSplitClick={(s) => setSelectedSplitSub(s)}
                        />
                    ))}
                </div>
            </div>

            <SplitCostModal
                isOpen={!!selectedSplitSub}
                onClose={() => setSelectedSplitSub(null)}
                subscription={selectedSplitSub}
            />
        </>
    )
}

