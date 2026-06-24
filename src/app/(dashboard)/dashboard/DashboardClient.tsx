"use client";

import { useState, useTransition } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Check, 
  Phone, 
  RefreshCw, 
  Sparkles,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Building,
  Activity,
  HeartHandshake,
  UserX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { completeTask, resetSarahAlert, simulateNewAlert } from "@/lib/db-actions";
import Link from "next/link";

interface DashboardClientProps {
  clinicId: string;
  stats: {
    pending: number;
    completed: number;
    alerts: number;
    rate: number;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignedToName: string;
    createdAt: Date;
    patient: {
      id: string;
      name: string;
      phone: string;
      status: string;
      predictiveRiskScore: number;
    };
  }>;
  alerts: Array<{
    id: string;
    responseText: string;
    sentiment: string;
    riskScore: number;
    respondedAt: Date;
    patient: {
      id: string;
      name: string;
      phone: string;
    };
  }>;
  recentFollowUps: Array<{
    id: string;
    title: string;
    status: string;
    scheduledDate: Date;
    patient: {
      name: string;
    };
  }>;
}

export default function DashboardClient({
  clinicId,
  stats,
  tasks,
  alerts,
  recentFollowUps
}: DashboardClientProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"tasks" | "alerts">("tasks");

  const handleResolveTask = (taskId: string) => {
    startTransition(async () => {
      await completeTask(taskId, "/dashboard");
    });
  };

  const handleSimulateAlert = () => {
    startTransition(async () => {
      await simulateNewAlert(clinicId);
    });
  };

  const handleResetSarah = () => {
    startTransition(async () => {
      await resetSarahAlert();
    });
  };

  return (
    <div className="space-y-8">
      {/* Simulation Controls Banner */}
      <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/10 text-teal-500">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-teal-400">
              AI Continuity & CRM Simulator
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-450">
              Reset Sarah Jenkins' post-op pain alert or trigger random symptom alerts to test the AI triage pipeline.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetSarah}
            disabled={isPending}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm whitespace-nowrap"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Sarah's Pain Alert
          </button>
          <button
            onClick={handleSimulateAlert}
            disabled={isPending}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-teal-600 disabled:opacity-50 transition-all shadow-md shadow-teal-500/10 dark:shadow-teal-500/5 whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Simulate New AI Alert
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Care Continuity Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time patient follow-up progress, AI triage alerts, and coordinator tasks.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full self-start md:self-auto">
          Today: {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Pending */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Outreach
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.pending}
            </span>
            <span className="text-[10px] font-medium text-slate-400">active items</span>
          </div>
        </div>

        {/* Card 2: Completed */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Journeys
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.completed}
            </span>
            <span className="text-[10px] font-medium text-emerald-500">+12% this week</span>
          </div>
        </div>

        {/* Card 3: AI Alerts */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Needs Attention
            </span>
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-500 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.alerts}
            </span>
            <span className="text-[10px] font-medium text-rose-500">requires review</span>
          </div>
        </div>

        {/* Card 4: Response Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Engagement Rate
            </span>
            <div className="rounded-lg bg-teal-500/10 p-2 text-teal-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.rate}%
            </span>
            <span className="text-[10px] font-medium text-teal-500">Industry benchmark 70%</span>
          </div>
        </div>
      </div>

      {/* Advanced Highlight Section: Doctor AI Follow-Up Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-4">
          <Sparkles className="h-4.5 w-4.5 text-teal-500" />
          Doctor's Weekly AI Follow-Up Summary (Autopilot Cohort Insights)
        </h3>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-4 space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Patients Recovering Well
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">45 patients</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              NLP analysis classified check-in checkmarks as Positive/Neutral recovery.
            </p>
          </div>

          <div className="rounded-lg bg-rose-500/5 border border-rose-500/10 p-4 space-y-1">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Requires Intervention
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.alerts} patient{stats.alerts !== 1 && "s"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Flagged high risk due to pain/bleeding or missed check-ins.
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 dark:bg-slate-950 p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Top Cohort Clinical Issues
            </span>
            <ul className="space-y-1 text-slate-700 dark:text-slate-350">
              <li className="flex justify-between font-medium">
                <span>1. Post-op swelling queries</span>
                <span className="font-bold text-slate-500">4 cases</span>
              </li>
              <li className="flex justify-between font-medium">
                <span>2. Hard food restrictions</span>
                <span className="font-bold text-slate-500">3 cases</span>
              </li>
              <li className="flex justify-between font-medium">
                <span>3. Pain medicine nausea</span>
                <span className="font-bold text-slate-500">1 case</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Alerts + Collaboration & Intelligence */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left/Middle Columns: Tasks & Triage alerts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${
                activeTab === "tasks"
                  ? "border-teal-500 text-teal-500 dark:text-teal-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Pending Care Team Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`ml-6 pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${
                activeTab === "alerts"
                  ? "border-teal-500 text-teal-500 dark:text-teal-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              AI NLP Sentiment Alerts ({alerts.length})
            </button>
          </div>

          <div className="min-h-[300px]">
            {activeTab === "tasks" ? (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {tasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      <UserCheck className="h-10 w-10 text-teal-500/50 mb-3" />
                      <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                        All Tasks Resolved
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                        Nurses have closed all pending follow-up overrides for this clinic.
                      </p>
                    </motion.div>
                  ) : (
                    tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className={`rounded-xl border p-5 shadow-sm bg-white dark:bg-slate-900 ${
                          task.priority === "Urgent" 
                            ? "border-l-4 border-l-rose-500 border-slate-200 dark:border-slate-800" 
                            : task.priority === "High"
                            ? "border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800"
                            : "border-l-4 border-l-slate-400 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                                task.priority === "Urgent" 
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" 
                                  : task.priority === "High"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }`}>
                                {task.priority}
                              </span>
                              <Link 
                                href={`/patients?clinicId=${clinicId}&patientId=${task.patient.id}`}
                                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                              >
                                {task.patient.name}
                              </Link>
                              <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                              <span className="text-[10px] text-slate-400 font-semibold bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-250/20">
                                Assigned to: {task.assignedToName}
                              </span>
                              <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                              <span className="text-[10px] text-slate-450">
                                AI Risk: {Math.round(task.patient.predictiveRiskScore * 100)}%
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-2">
                              {task.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:${task.patient.phone}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                              title="Call Patient"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                            <button
                              onClick={() => handleResolveTask(task.id)}
                              disabled={isPending}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white hover:bg-teal-600 shadow-sm"
                              title="Resolve & Archive Task"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <ShieldAlert className="h-10 w-10 text-teal-500/50 mb-3" />
                    <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                      No critical symptoms flagged
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                      Natural language processing has not flagged any negative or high-risk responses today.
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 border-l-4 border-l-rose-500"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                            <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
                              Risk Score: {Math.round(alert.riskScore * 100)}% (Severe)
                            </span>
                            <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                            <span className="text-xs text-slate-400">
                              {new Date(alert.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <Link 
                            href={`/patients?clinicId=${clinicId}&patientId=${alert.patient.id}`}
                            className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:underline block pt-1.5"
                          >
                            {alert.patient.name}
                          </Link>
                          <div className="mt-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 p-3 text-xs text-slate-700 dark:text-slate-300 italic">
                            &ldquo;{alert.responseText}&rdquo;
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/messages?clinicId=${clinicId}&patientId=${alert.patient.id}`}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-teal-500" />
                            Open Chat
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Performance intelligence & Today's Followup */}
        <div className="space-y-6">
          
          {/* Clinic Performance Intelligence (CRM Insights) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
              <Building className="h-4 w-4 text-teal-500" />
              SaaS Performance Metrics
            </h3>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <span className="text-[20px] font-black text-teal-500">88%</span>
                <span className="block text-[8px] text-slate-400 font-bold uppercase mt-1">SMS Reply</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <span className="text-[20px] font-black text-indigo-500">320</span>
                <span className="block text-[8px] text-slate-400 font-bold uppercase mt-1">Reschedules</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <span className="text-[20px] font-black text-emerald-500">94%</span>
                <span className="block text-[8px] text-slate-400 font-bold uppercase mt-1">Patient Sat</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Auto-tracked by CareLoop NLP classifiers syncing check-in sentiment metrics weekly.
            </p>
          </div>

          {/* Today's Followup Queue */}
          <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Today's Outreach Queue
              </h4>
            </div>

            <div className="space-y-4">
              {recentFollowUps.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No scheduled outreach messages today.
                </p>
              ) : (
                recentFollowUps.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800 last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <span className="font-semibold text-slate-850 dark:text-slate-200">
                        {item.patient.name}
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">
                        {item.title}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      item.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : item.status === "Escalated"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            <Link
              href={`/patients?clinicId=${clinicId}`}
              className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 py-1 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors"
            >
              <span>View All Patient Cohorts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Educational CRM Tip */}
          <div className="rounded-xl border border-teal-500/10 bg-gradient-to-br from-teal-500/5 to-indigo-500/5 p-5 glass-panel">
            <h4 className="text-xs font-bold uppercase text-teal-600 dark:text-teal-400 tracking-wider">
              Care Continuity Tip
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-350 mt-2 leading-relaxed">
              Patients engaged through interactive portals are <strong>4.2x more likely</strong> to follow medication guidelines and complete recovery check-ups on time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
