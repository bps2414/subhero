import { login } from './actions'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            {/* Background orbs/gradients for glassmorphism effect */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Bem-vindo(a) ao SubHero</h1>
                    <p className="text-zinc-400 mt-2 text-center">
                        Faça login para gerenciar suas assinaturas e parar de perder dinheiro.
                    </p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                Endereço de email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="voce@exemplo.com"
                                required
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-sans"
                            />
                        </div>

                        <button
                            formAction={login}
                            className="mt-2 w-full px-4 py-3 bg-white text-zinc-950 font-semibold rounded-xl hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                        >
                            Entrar / Criar Conta
                        </button>

                        {searchParams?.message && (
                            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                <p className="text-sm text-purple-200 text-center">
                                    {searchParams.message}
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
