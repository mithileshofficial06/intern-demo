import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { DashboardHeader } from "@/components/auth/DashboardHeader"
import BackgroundEffects from "@/components/landing/BackgroundEffects"
import BrutalMarquee from "@/components/landing/BrutalMarquee"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Fetch user's apps
  const apps = await prisma.appConfig.findMany({
    where: {
      userId: session.user.id!,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden font-sans">
      {/* Background layers */}
      <div className="bg-grain" aria-hidden="true" />
      <div className="bg-scanlines" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      {/* Top marquee */}
      <BrutalMarquee />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-black bg-[#ffe600] text-black py-6 px-6 lg:px-12 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black bg-black text-[#ffe600] px-2 py-0.5 tracking-wider uppercase">
                // SYSTEM_CONTROL
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mt-1">
              MY APPLICATIONS
            </h1>
          </div>
          <DashboardHeader user={session.user} />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 flex-1 w-full flex flex-col min-h-0">
        {/* Actions bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-white/10 pb-6 shrink-0">
          <div>
            <span className="text-xs font-mono text-white/50 tracking-wider font-bold uppercase">
              // ACTIVE INSTANCES: {apps.length}
            </span>
          </div>
          <Link
            href="/editor"
            className="inline-block text-center px-6 py-3 bg-[#ffe600] text-black border-4 border-black font-black uppercase tracking-wider shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#ff2d2d] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs shrink-0"
          >
            + Create New App
          </Link>
        </div>

        {/* Apps List */}
        {apps.length === 0 ? (
          <div className="text-center py-20 flex justify-center items-center flex-1">
            <div className="brutal-box max-w-md p-8 bg-[#0d0d0d] border-[#ffe600] shadow-[8px_8px_0_#000]" style={{ borderColor: '#ffe600' }}>
              <div className="w-12 h-12 bg-black border-2 border-[#ffe600] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="animate-pulse text-[#ffe600] text-lg font-black font-mono">?</span>
              </div>
              <h2 className="text-2xl font-black mb-3 text-[#ffe600] uppercase tracking-tight">NO APPS YET</h2>
              <p className="text-white/60 mb-6 font-mono text-xs leading-relaxed uppercase">
                PASTE YOUR JSON CONFIG IN THE EDITOR AND CLICK GENERATE TO DEPLOY YOUR FIRST APP INSTANTLY.
              </p>
              <Link
                href="/editor"
                className="inline-block px-5 py-3 bg-[#ffe600] text-black border-2 border-black font-black uppercase text-xs tracking-widest shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                GO TO CONFIG EDITOR
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app) => (
              <Link
                key={app.id}
                href={`/${app.appId}`}
                className="block p-6 bg-black border-4 border-[#ffe600] hover:border-white shadow-[6px_6px_0_#ffe600] hover:shadow-[8px_8px_0_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all group"
                style={{ contentVisibility: 'auto' }}
              >
                <div className="flex items-start justify-between mb-4 gap-2">
                  <h3 className="text-2xl font-black tracking-tight text-[#ffe600] group-hover:text-white uppercase transition-colors">
                    {app.name}
                  </h3>
                  <span className="text-xs font-mono text-black font-bold bg-[#ffe600] px-3 py-1 border-2 border-black shrink-0">
                    {app.appId.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 text-base font-mono text-white border-t-2 border-[#ffe600]/30 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#ffe600] font-bold uppercase">CREATED:</span>
                    <span className="text-white font-bold">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#ffe600] font-bold uppercase">ENTITIES:</span>
                    <span className="font-black text-[#00ff66] text-lg">
                      {Array.isArray((app.config as any)?.entities) ? (app.config as any).entities.length : 0}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-4 border-[#ffe600] flex items-center justify-between">
                  <span className="text-base font-black text-[#ffe600] uppercase group-hover:text-white group-hover:underline tracking-widest">
                    LAUNCH RUNTIME →
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#00ff66] animate-pulse shadow-[0_0_8px_#00ff66]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom marquee */}
      <BrutalMarquee />
    </div>
  )
}
