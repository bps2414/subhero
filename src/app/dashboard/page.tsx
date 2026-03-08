import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SummaryCard } from '@/components/summary-card'
import { SubscriptionList } from '@/components/subscription-list'
import { DashboardActions } from '@/components/dashboard-actions'
import { InsightsCard } from '@/components/insights-card'
import {
    DollarSign,
    CreditCard,
    CalendarClock,
} from 'lucide-react'

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export default async function DashboardPage() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch subscriptions
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('next_billing_date', { ascending: true })

    const subs = subscriptions ?? []

    // --- Compute summary metrics ---
    const monthlyCost = subs.reduce((acc, sub) => {
        if (sub.billing_cycle === 'monthly') return acc + Number(sub.price)
        if (sub.billing_cycle === 'yearly') return acc + Number(sub.price) / 12
        return acc
    }, 0)

    // Upcoming renewals in next 7 days
    const today = new Date()
    const in7Days = new Date(today)
    in7Days.setDate(in7Days.getDate() + 7)

    const upcoming = subs.filter((sub) => {
        const nextDate = new Date(sub.next_billing_date)
        return nextDate >= today && nextDate <= in7Days
    })

    const displayName = user.email?.split('@')[0] ?? 'User'

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome + Add Button */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Welcome back, <span className="text-purple-400">{displayName}</span> 👋
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Here&apos;s an overview of your subscriptions and spending.
                    </p>
                </div>
                <DashboardActions />
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SummaryCard
                    title="Monthly Total"
                    value={formatCurrency(monthlyCost)}
                    subtitle="All active subscriptions"
                    icon={DollarSign}
                    accentColor="purple"
                    className="stagger-1 animate-fade-in"
                />
                <SummaryCard
                    title="Active Subscriptions"
                    value={subs.length.toString()}
                    subtitle={subs.length === 1 ? '1 service tracked' : `${subs.length} services tracked`}
                    icon={CreditCard}
                    accentColor="blue"
                    className="stagger-2 animate-fade-in"
                />
                <SummaryCard
                    title="Upcoming (7 days)"
                    value={upcoming.length.toString()}
                    subtitle={
                        upcoming.length > 0
                            ? `${formatCurrency(upcoming.reduce((a, s) => a + Number(s.price), 0))} due soon`
                            : 'Nothing coming up'
                    }
                    icon={CalendarClock}
                    accentColor="orange"
                    className="stagger-3 animate-fade-in"
                />
            </div>

            {/* Insights Gamification Card */}
            <InsightsCard subscriptions={subs} />

            {/* Subscription List */}
            <SubscriptionList subscriptions={subs} />
        </div>
    )
}
