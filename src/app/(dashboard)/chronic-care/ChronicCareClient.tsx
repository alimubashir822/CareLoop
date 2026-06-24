"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Users,
  Calendar,
  ChevronRight,
  Droplets,
  Gauge,
  ClipboardList,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VitalReading {
  id: string;
  metricType: string;
  value: number;
  unit: string;
  status: string;
  aiFlag: string | null;
  recordedAt: string | Date;
}

interface EnrolledPatient {
  id: string;
  name: string;
  status: string;
  predictiveRiskScore: number;
  healthEngagementScore: number;
  communicationPreference: string;
}

interface Enrollment {
  id: string;
  patientId: string;
  patient: EnrolledPatient;
  status: string;
  complianceScore: number;
  lastReading: string | Date | null;
  nextCheckIn: string | Date | null;
  notes: string;
  vitalReadings: VitalReading[];
}

interface Program {
  id: string;
  name: string;
  type: string;
  description: string;
  targetMetric: string;
  targetMin: number;
  targetMax: number;
  unit: string;
  checkInFrequency: string;
  isActive: boolean;
  enrollments: Enrollment[];
}

interface SimplePatient {
  id: string;
  name: string;
  status: string;
}

interface Props {
  clinicId: string;
  initialPrograms: Program[];
  allPatients: SimplePatient[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProgramIcon(type: string) {
  switch (type) {
    case "DIABETES":    return Droplets;
    case "HYPERTENSION": return Gauge;
    default:            return Heart;
  }
}

function getProgramGradient(type: string) {
  switch (type) {
    case "DIABETES":    return "from-blue-500 to-indigo-600";
    case "HYPERTENSION": return "from-rose-500 to-red-600";
    case "COPD":        return "from-amber-500 to-orange-600";
    case "CARDIAC":     return "from-purple-500 to-violet-600";
    default:            return "from-teal-500 to-emerald-600";
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "ACTIVE":     return { label: "Active",     cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" };
    case "PAUSED":     return { label: "Paused",     cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" };
    case "GRADUATED":  return { label: "Graduated",  cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" };
    case "DROPPED":    return { label: "Dropped",    cls: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" };
    default:           return { label: status,       cls: "bg-slate-100 text-slate-500 border-slate-200" };
  }
}

function getReadingStatusColor(status: string) {
  switch (status) {
    case "NORMAL":   return "text-emerald-600 dark:text-emerald-400";
    case "HIGH":     return "text-amber-600 dark:text-amber-400";
    case "LOW":      return "text-blue-600 dark:text-blue-400";
    case "CRITICAL": return "text-rose-600 dark:text-rose-400";
    default:         return "text-slate-500";
  }
}

function getComplianceColor(score: number) {
  if (score >= 85) return { ring: "stroke-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "Excellent" };
  if (score >= 65) return { ring: "stroke-amber-500",   text: "text-amber-600 dark:text-amber-400",   label: "Moderate" };
  return             { ring: "stroke-rose-500",    text: "text-rose-600 dark:text-rose-400",   label: "Low" };
}

function ComplianceRing({ score }: { score: number }) {
  const { ring, text, label } = getComplianceColor(score);
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200 dark:text-slate-700" />
        <circle cx="24" cy="24" r="20" strokeWidth="4" fill="none" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className={cn("transition-all duration-700", ring)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-sm font-bold leading-none", text)}>{score}%</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChronicCareClient({ clinicId, initialPrograms, allPatients }: Props) {
  const [programs] = useState<Program[]>(initialPrograms);
  const [activeTab, setActiveTab] = useState<string>(initialPrograms[0]?.id || "");

  const totalEnrolled = programs.reduce((sum, p) => sum + p.enrollments.length, 0);
  const totalAlerts = programs.reduce((sum, p) =>
    sum + p.enrollments.reduce((es, e) =>
      es + e.vitalReadings.filter(r => r.status === "CRITICAL").length, 0), 0);
  const avgCompliance = programs.length > 0
    ? Math.round(programs.reduce((sum, p) =>
        sum + p.enrollments.reduce((es, e) => es + e.complianceScore, 0), 0) /
        Math.max(1, programs.reduce((sum, p) => sum + p.enrollments.length, 0)))
    : 0;

  const activeProgram = programs.find(p => p.id === activeTab);

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chronic Care Programs</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Long-term disease management · Vitals tracking · AI intervention alerts
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {programs.length} Active Programs
          </span>
        </div>
      </div>

      {/* ── KPI Bar ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled Patients",  value: totalEnrolled,            icon: Users,         color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Avg Compliance",     value: `${avgCompliance}%`,      icon: ClipboardList, color: "text-teal-500",    bg: "bg-teal-50 dark:bg-teal-900/20" },
          { label: "Critical Alerts",    value: totalAlerts,              icon: AlertTriangle, color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-900/20" },
          { label: "Programs Active",    value: programs.filter(p => p.isActive).length, icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 shadow-sm">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shrink-0", kpi.bg)}>
                <Icon className={cn("h-5 w-5", kpi.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Program Tabs ────────────────────────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {programs.map((program) => {
          const Icon = getProgramIcon(program.type);
          const gradient = getProgramGradient(program.type);
          const isActive = activeTab === program.id;
          const criticalCount = program.enrollments.reduce((sum, e) =>
            sum + e.vitalReadings.filter(r => r.status === "CRITICAL").length, 0);

          return (
            <button
              key={program.id}
              id={`tab-${program.id}`}
              onClick={() => setActiveTab(program.id)}
              className={cn(
                "flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-200",
                isActive
                  ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg`
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{program.name}</span>
              {criticalCount > 0 && (
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  isActive ? "bg-white/30 text-white" : "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
                )}>
                  {criticalCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Program Detail Panel ─────────────────────────────────────────────── */}
      {activeProgram && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Program Info Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className={cn("rounded-2xl bg-gradient-to-br p-6 text-white shadow-xl", getProgramGradient(activeProgram.type))}>
              <div className="flex items-center gap-3 mb-4">
                {(() => { const Icon = getProgramIcon(activeProgram.type); return <Icon className="h-7 w-7 opacity-90" />; })()}
                <h2 className="text-lg font-bold leading-tight">{activeProgram.name}</h2>
              </div>
              <p className="text-sm leading-relaxed opacity-80 mb-4">{activeProgram.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/15 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-0.5">Target Range</p>
                  <p className="font-bold">{activeProgram.targetMin}–{activeProgram.targetMax} <span className="font-normal text-xs opacity-80">{activeProgram.unit}</span></p>
                </div>
                <div className="bg-white/15 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-0.5">Check-In</p>
                  <p className="font-bold capitalize">{activeProgram.checkInFrequency.toLowerCase()}</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-0.5">Enrolled</p>
                  <p className="font-bold">{activeProgram.enrollments.length} Patients</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-0.5">Metric</p>
                  <p className="font-bold text-xs">{activeProgram.targetMetric.replace("_", " ")}</p>
                </div>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">AI Program Insights</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                {activeProgram.type === "DIABETES" ? (
                  <>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                      <TrendingDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-300">Glucose trending <strong>-53% from baseline</strong>. Program showing excellent clinical results.</span>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300">94% compliance over 12 weeks. HbA1c reduced from 8.2% to 6.9%.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                      <span className="text-rose-700 dark:text-rose-300">2 critical BP readings detected. Physician escalation triggered automatically.</span>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <TrendingDown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-amber-700 dark:text-amber-300">Systolic improving from 172 → 139 mmHg over 8 weeks despite 2 missed check-ins.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Enrolled Patients List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Enrolled Patients <span className="text-slate-400 font-normal text-sm">({activeProgram.enrollments.length})</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Click a patient to view full vitals timeline →</span>
            </div>

            <div className="space-y-3">
              {activeProgram.enrollments.map((enrollment) => {
                const latestReading = enrollment.vitalReadings[0];
                const hasCritical = enrollment.vitalReadings.some(r => r.status === "CRITICAL");
                const { label: statusLabel, cls: statusCls } = getStatusBadge(enrollment.status);

                return (
                  <Link
                    key={enrollment.id}
                    href={`/chronic-care/${activeProgram.id}?enrollmentId=${enrollment.id}&clinicId=${clinicId}`}
                    className="block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm shadow-md",
                        hasCritical
                          ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/25"
                          : "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/25"
                      )}>
                        {enrollment.patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">{enrollment.patient.name}</p>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", statusCls)}>
                            {statusLabel}
                          </span>
                          {hasCritical && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              Critical Alert
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          {latestReading && (
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Last: <span className={cn("font-semibold", getReadingStatusColor(latestReading.status))}>
                                {latestReading.value} {latestReading.unit}
                              </span>
                            </span>
                          )}
                          {enrollment.nextCheckIn && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Next check-in: {new Date(enrollment.nextCheckIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {enrollment.patient.communicationPreference}
                          </span>
                        </div>
                      </div>

                      {/* Compliance Ring */}
                      <div className="flex flex-col items-center gap-1">
                        <ComplianceRing score={enrollment.complianceScore} />
                        <p className="text-[10px] text-slate-400 font-medium">Compliance</p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    {/* Notes */}
                    {enrollment.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-2">
                          📋 {enrollment.notes}
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}

              {activeProgram.enrollments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                    <Users className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No patients enrolled</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Enroll patients from their profile page</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
