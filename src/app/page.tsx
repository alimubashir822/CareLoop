import Link from "next/link";
import { Activity, LayoutDashboard, UserCheck, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-300 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900 z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <span className="font-bold tracking-tight text-white text-lg">
            CareLoop <span className="text-teal-400">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            v1.0 MVP Launch
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto px-6 py-16 md:py-24 z-10 flex-1 flex flex-col justify-center gap-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 text-xs font-bold text-teal-400">
            <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
            Post-Appointment Care Continuity Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Keep Care Connected <br />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
              Beyond the Clinic Visit
            </span>
          </h1>
          
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            CareLoop AI automates post-visit follow-ups, tracks symptoms, analyzes recovery sentiments, and flags clinical risks to retain patient engagement and improve recovery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/dashboard?clinicId=dental-clinic-id"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/10 transition-all group"
            >
              Enter Clinician Console
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/portal/sarah-jenkins?clinicId=dental-clinic-id"
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-all"
            >
              Open Patient Portal Simulator
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h3 className="text-md font-bold text-white">Clinic Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track recovery progress, monitor response rates, review nurse task queues, and toggle organizations in a sleek, premium interface.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-md font-bold text-white">Care Journey Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ditch simple reminders. Create visual timelines connecting Trigger events to Wait delays, custom SMS text checks, and AI response conditions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <h3 className="text-md font-bold text-white">AI Symptom Triage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluate natural language patient texts. Detect severity signs like fever or bleeding, assign high-risk statuses, and raise provider tickets.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 h-16 flex items-center justify-between text-xs text-slate-600 border-t border-slate-900 z-10 shrink-0">
        <span>© 2026 CareLoop AI Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 transition-colors">HIPAA Compliant</span>
          <span>•</span>
          <span className="hover:text-slate-400 transition-colors">EHR Sandbox Ready</span>
        </div>
      </footer>

    </div>
  );
}
