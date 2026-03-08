import { TrendingDown, Award, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Subscription {
    id: string
    service_name: string
    price: number
    billing_cycle: 'monthly' | 'yearly'
    color_hex: string
}

interface InsightsCardProps {
    subscriptions: Subscription[]
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export function InsightsCard({ subscriptions }: InsightsCardProps) {
    if (subscriptions.length === 0) return null

    // Calculate total monthly impact
    const monthlyCost = subscriptions.reduce((acc, sub) => {
        if (sub.billing_cycle === 'monthly') return acc + Number(sub.price)
        if (sub.billing_cycle === 'yearly') return acc + Number(sub.price) / 12
        return acc
    }, 0)

    const yearlyCost = monthlyCost * 12

    // Find the most expensive subscription (normalized to monthly)
    const sortedByCost = [...subscriptions].sort((a, b) => {
        const aMonthly = a.billing_cycle === 'monthly' ? a.price : a.price / 12
        const bMonthly = b.billing_cycle === 'monthly' ? b.price : b.price / 12
        return bMonthly - aMonthly
    })

    const topExpense = sortedByCost[0]
    const topExpenseMonthly = topExpense.billing_cycle === 'monthly' ? topExpense.price : topExpense.price / 12
    const percentageOfTotal = Math.round((topExpenseMonthly / monthlyCost) * 100)

    let insightMessage = ""
    let insightIcon = <Award className="w-5 h-5 text-purple-400" />
    let insightTone = "purple"

    if (yearlyCost > 2000) {
        insightMessage = "You're spending quite a lot. Consider reviewing unused services."
        insightIcon = <AlertTriangle className="w-5 h-5 text-red-400" />
        insightTone = "red"
    } else if (subscriptions.length > 5) {
        insightMessage = "You have many active services. A quick audit might save you money!"
        insightIcon = <TrendingDown className="w-5 h-5 text-orange-400" />
        insightTone = "orange"
    } else {
        insightMessage = "Your subscriptions are looking lean and optimized. Great job!"
        insightIcon = <Award className="w-5 h-5 text-green-400" />
        insightTone = "green"
    }

    return (
        <div className="glass-card overflow-hidden animate-fade-in stagger-4">
            {/* Top Banner */}
            <div className={cn(
                "px-6 py-4 flex items-center justify-between border-b border-white/[0.05]",
                insightTone === "red" && "bg-red-500/10",
                insightTone === "orange" && "bg-orange-500/10",
                insightTone === "green" && "bg-green-500/10",
                insightTone === "purple" && "bg-purple-500/10",
            )}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-950/50 rounded-xl shadow-inner">
                        {insightIcon}
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">SubHero AI Insight</h2>
                        <p className="text-xs text-zinc-300 mt-0.5">{insightMessage}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Core Metric */}
                <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium text-zinc-500 mb-2">Projected Yearly Spend</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                            {formatCurrency(yearlyCost)}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                        That&apos;s roughly {formatCurrency(yearlyCost / 12)} per month dedicated to subscriptions.
                    </p>
                </div>

                {/* Top Expense */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0"
                        style={{
                            backgroundColor: topExpense.color_hex + '20',
                            color: topExpense.color_hex,
                            boxShadow: `0 4px 12px ${topExpense.color_hex}15`,
                        }}
                    >
                        {topExpense.service_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-500 mb-0.5">Biggest Drain</p>
                        <p className="text-sm font-bold text-white truncate">{topExpense.service_name}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Taking up <span className="text-zinc-300 font-semibold">{percentageOfTotal}%</span> of your budget
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-white">{formatCurrency(topExpenseMonthly)}</p>
                        <p className="text-[10px] text-zinc-500">/mo</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
