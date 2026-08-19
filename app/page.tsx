import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  // If already signed in, send straight to the app
  const { userId } = await auth();
  if (userId) redirect("/compare");

  return (
    <main className="min-h-screen text-stone-900">
      {/* ── Gradient mesh background ── */}
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Base warm cream */}
        <div className="absolute inset-0 bg-[#FAF9F6]" />
        {/* Mesh blobs */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 55% at 8% 8%,  rgba(245,158,11,0.22) 0%, transparent 68%),
              radial-gradient(ellipse 55% 45% at 92% 6%,  rgba(251,191,36,0.14) 0%, transparent 62%),
              radial-gradient(ellipse 50% 55% at 78% 88%, rgba(217,119,6,0.16)  0%, transparent 65%),
              radial-gradient(ellipse 60% 50% at 4%  92%, rgba(253,230,138,0.2) 0%, transparent 68%),
              radial-gradient(ellipse 40% 40% at 50% 38%, rgba(251,191,36,0.08) 0%, transparent 60%)
            `,
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>
      {/* ── Nav ── */}
      <nav className="px-6 py-4 flex items-center gap-3 bg-[rgba(255,255,255,0.7)] backdrop-blur-md sticky top-0 z-10 border-b border-[#EAE6DE]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="SCX" className="h-8 w-auto" />
        <div className="flex-1" />
        <SignInButton mode="redirect" fallbackRedirectUrl="/compare">
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 border border-[#E0D9CE] hover:border-amber-300 transition-all duration-150">
            Sign in
          </button>
        </SignInButton>
        <SignInButton mode="redirect" fallbackRedirectUrl="/compare">
          <button className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all duration-150 shadow-sm">
            Try it free →
          </button>
        </SignInButton>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(245,158,11,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Powered by SCX.ai · 15 frontier models
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 leading-tight max-w-3xl text-balance">
          Compare AI models.{" "}
          <span className="text-amber-600">Side by side.</span>
          <br />In real time.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-stone-500 max-w-xl text-balance leading-relaxed">
          Pick up to three frontier models — GPT, Llama, Qwen, DeepSeek and more — type one prompt,
          and watch responses stream in simultaneously. Know which model actually fits your task.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center">
          <SignInButton mode="redirect" fallbackRedirectUrl="/compare">
            <button className="px-8 py-4 rounded-xl bg-amber-600 text-white text-base font-semibold hover:bg-amber-700 hover:shadow-[0_0_32px_rgba(217,119,6,0.4)] transition-all duration-150 shadow-md">
              Start comparing →
            </button>
          </SignInButton>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl border border-[#D1C9BC] text-stone-700 text-base font-medium hover:bg-amber-50 hover:border-amber-300 transition-all duration-150"
          >
            See how it works
          </a>
        </div>

        {/* App screenshot preview */}
        <div className="mt-16 w-full max-w-5xl mx-auto rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.10)] overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EAE6DE] bg-stone-50">
            <div className="w-3 h-3 rounded-full bg-rose-400/70" />
            <div className="w-3 h-3 rounded-full bg-amber-400/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
            <div className="flex-1 mx-4 h-6 rounded-lg bg-stone-200/70 text-xs text-stone-400 flex items-center px-3">
              scx-project.vercel.app/compare
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/landing.png" alt="SCX Model Comparison app" className="w-full block" />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-stone-900 mb-4">
            Everything you need to evaluate models
          </h2>
          <p className="text-center text-stone-500 mb-14 max-w-xl mx-auto">
            No switching tabs, no copy-pasting. One prompt, all the answers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                ),
                title: "Live streaming",
                desc: "Responses from every model stream in simultaneously over SSE — no waiting, no page reloads.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ),
                title: "Reasoning trace",
                desc: "Models that think (Qwen3, MiniMax, gpt-oss) surface their chain-of-thought in a collapsible section.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                ),
                title: "Vision input",
                desc: "Attach an image and compare how vision models (Llama 4, Qwen3.8-Max) interpret it differently.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                ),
                title: "Response metrics",
                desc: "Time-to-first-token and total token usage shown per panel — know cost before you commit.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                ),
                title: "Mobile-ready",
                desc: "Horizontal snap scroll on phones keeps all panels accessible without sacrificing the desktop grid.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                title: "Secure by default",
                desc: "Clerk authentication keeps the app private. API key lives server-side only — never exposed to the browser.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[#E8E4DC] bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-150 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Models strip ── */}
      <section className="py-16 px-6 border-t border-b border-[#EAE6DE] bg-white/60">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-stone-400 uppercase tracking-widest mb-8">
            Frontier models available via SCX.ai
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "GPT-OSS 120B", "Llama 4 Maverick", "Qwen3-32B", "Qwen3.8-Max",
              "GLM-5.2", "MiniMax-M2.7", "DeepSeek-V4-Pro", "DeepSeek-V4-Flash",
              "DeepSeek-V3.1", "MAGPiE 117B", "SCX Coder", "gemma-4-31B",
              "Llama-3.3-70B", "MiniMax-M2.5", "GLM-5.2-Fast",
            ].map((m) => (
              <span
                key={m}
                className="px-3 py-1.5 rounded-full border border-[#E0D9CE] bg-white text-xs text-stone-600 font-medium shadow-sm"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-2xl shadow-[0_8px_28px_rgba(217,119,6,0.28)] mx-auto mb-6">
            S
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Ready to find your model?
          </h2>
          <p className="text-stone-500 mb-8">
            Free to try. No card required. Just sign in and start comparing.
          </p>
          <SignInButton mode="redirect" fallbackRedirectUrl="/compare">
            <button className="px-10 py-4 rounded-xl bg-amber-600 text-white text-base font-semibold hover:bg-amber-700 hover:shadow-[0_0_40px_rgba(217,119,6,0.4)] transition-all duration-150 shadow-lg">
              Get started — it&apos;s free →
            </button>
          </SignInButton>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#EAE6DE] px-6 py-8 text-center text-xs text-stone-400">
        Built with Next.js 14 · SCX.ai API · Clerk · Tailwind CSS
      </footer>
    </main>
  );
}
