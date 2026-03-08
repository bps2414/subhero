import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
    title: string
    value: string
    subtitle?: string
    icon: LucideIcon
    trend?: {
        value: string
        positive: boolean
    }
    accentColor?: 'purple' | 'blue' | 'green' | 'orange' | 'red'
    className?: string
}

const accentMap = {
    purple: {
        iconBg: 'bg-purple-500/10',
        iconText: 'text-purple-400',
        glow: 'shadow-purple-500/5',
        trendPos: 'text-green-400 bg-green-500/10',
        trendNeg: 'text-red-400 bg-red-500/10',
    },
    blue: {
        iconBg: 'bg-blue-500/10',
        iconText: 'text-blue-400',
        glow: 'shadow-blue-500/5',
        trendPos: 'text-green-400 bg-green-500/10',
        trendNeg: 'text-red-400 bg-red-500/10',
    },
    green: {
        iconBg: 'bg-green-500/10',
        iconText: 'text-green-400',
        glow: 'shadow-green-500/5',
        trendPos: 'text-green-400 bg-green-500/10',
        trendNeg: 'text-red-400 bg-red-500/10',
    },
    orange: {
        iconBg: 'bg-orange-500/10',
        iconText: 'text-orange-400',
        glow: 'shadow-orange-500/5',
        trendPos: 'text-green-400 bg-green-500/10',
        trendNeg: 'text-red-400 bg-red-500/10',
    },
    red: {
        iconBg: 'bg-red-500/10',
        iconText: 'text-red-400',
        glow: 'shadow-red-500/5',
        trendPos: 'text-green-400 bg-green-500/10',
        trendNeg: 'text-red-400 bg-red-500/10',
    },
}

export function SummaryCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    accentColor = 'purple',
    className,
}: SummaryCardProps) {
    const accent = accentMap[accentColor]

    return (
        <div
            className={cn(
                'glass-card p-5 flex flex-col gap-4 hover:border-zinc-700/60 transition-all duration-300 group',
                accent.glow,
                className
            )}
        >
            {/* Top row: icon + trend */}
            <div className="flex items-center justify-between">
                <div className={cn('p-2.5 rounded-xl', accent.iconBg)}>
                    <Icon className={cn('w-5 h-5', accent.iconText)} />
                </div>
                {trend && (
                    <span
                        className={cn(
                            'text-[11px] font-semibold px-2 py-1 rounded-full',
                            trend.positive ? accent.trendPos : accent.trendNeg
                        )}
                    >
                        {trend.positive ? '↑' : '↓'} {trend.value}
                    </span>
                )}
            </div>

            {/* Value */}
            <div>
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                <p className="text-sm text-zinc-500 mt-1">{title}</p>
                {subtitle && (
                    <p className="text-xs text-zinc-600 mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
    )
}
