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

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome + Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-zinc-400 mt-1">Bem-vindo de volta! Gerencie suas assinaturas ativas.</p>
                </div>
                <DashboardActions />
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SummaryCard
                    title="Total Mensal"
                    value={formatCurrency(monthlyCost)}
                    subtitle="Todas as assinaturas ativas"
                    icon={DollarSign}
                    accentColor="purple"
                    className="stagger-1 animate-fade-in"
                />
                <SummaryCard
                    title="Assinaturas Ativas"
                    value={subs.length.toString()}
                    subtitle={subs.length === 1 ? '1 serviço rastreado' : `${subs.length} serviços rastreados`}
                    icon={CreditCard}
                    accentColor="blue"
                    className="stagger-2 animate-fade-in"
                />
                <SummaryCard
                    title="Próximas Cobranças"
                    value={upcoming.length.toString()}
                    subtitle={
                        upcoming.length > 0
                            ? `${formatCurrency(upcoming.reduce((a, s) => a + Number(s.price), 0))} vencendo em breve`
                            : 'Nada vencendo em breve'
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
