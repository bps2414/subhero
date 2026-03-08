import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] relative">
            {/* Background ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] bg-purple-600/[0.07] rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-600/[0.06] rounded-full blur-[140px]" />
            </div>

            <Sidebar />

            {/* Main content area */}
            <div className="ml-[var(--sidebar-width)] min-h-screen flex flex-col relative z-10">
                <Header />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
