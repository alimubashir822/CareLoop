"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  ArrowLeft,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Droplets,
  Gauge,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Calendar,
  Clock,
  Zap,
  Shield,
  User,
  Phone,
  Mail,
  ChevronRight,
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
  source: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  predictiveRiskScore: number;
  healthEngagementScore: number;
  communicationPreference: string;
  memoryNotes: string;
}

interface Enrollment {
  id: string;
  patientId: string;
  patient: Patient;
  enrolledAt: string | Date;
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

interface Props {
  clinicId: string;
  program: Program;
  activeEnrollment: Enrollment | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProgramGradient(type: string) {
  switch (type) {
    case "DIABETES":     return { from: "#3b82f6", to: "#6366f1", cls: "from-blue-500 to-indigo-600" };
    case "HYPERTENSION": return { from: "#f43f5e", to: "#ef4444", cls: "from-rose-500 to-red-600" };
    default:             return { from: "#14b8a6", to: "#10b981", cls: "from-teal-500 to-emerald-600" };
  }
}

function getReadingStatusConfig(status: string) {
  switch (status) {
    case "NORMAL":   return { label: "Normal",   bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" };
    case "HIGH":     return { label: "High",     bg: "bg-amber-50 dark:bg-amber-900/20",     text: "text-amber-700 dark:text-amber-400",     border: "border-amber-200 dark:border-amber-800",     dot: "bg-amber-500" };
    case "LOW":      return { label: "Low",      bg: "bg-blue-50 dark:bg-blue-900/20",       text: "text-blue-700 dark:text-blue-400",       border: "border-blue-200 dark:border-blue-800",       dot: "bg-blue-500" };
    case "CRITICAL": return { label: "Critical", bg: "bg-rose-50 dark:bg-rose-900/20",       text: "text-rose-700 dark:text-rose-400",       border: "border-rose-200 dark:border-rose-800",       dot: "bg-rose-500 animate-pulse" };
    default:         return { label: status,     bg: "bg-slate-50 dark:bg-slate-800",        text: "text-slate-600 dark:text-slate-400",     border: "border-slate-200 dark:border-slate-700",     dot: "bg-slate-400" };
  }
}

function getChartColor(type: string) {
  switch (type) {
    case "DIABETES":     return { stroke: "#6366f1", fill: "#6366f1" };
    case "HYPERTENSION": return { stroke: "#f43f5e", fill: "#f43f5e" };
    default:             return { stroke: "#14b8a6", fill: "#14b8a6" };
  }
}

// Custom tooltip for recharts
function CustomTooltip({ active, payload, label, targetMin, targetMax, unit }: {
  active?: boolean; payload?: Array<{ value: number }>; label?: string;
  targetMin: number; targetMax: number; unit: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const inRange = value >= targetMin && value <= targetMax;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={cn("text-lg font-bold", inRange ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
        {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
      </p>
      <p className={cn("text-xs mt-0.5 font-medium", inRange ? "text-emerald-500" : "text-rose-500")}>
        {inRange ? "✓ In target range" : `⚠ Target: ${targetMin}–${targetMax} ${unit}`}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProgramDetailClient({ clinicId, program, activeEnrollment }: Props) {
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(activeEnrollment);
  const gradient = getProgramGradient(program.type);
  const chartColor = getChartColor(program.type);

  // Build chart data from the primary metric
  const primaryMetric = program.type === "HYPERTENSION" ? "SYSTOLIC_BP" : "GLUCOSE";
  const chartReadings = (selectedEnrollment?.vitalReadings ?? [])
    .filter((r) => r.metricType === primaryMetric)
    .map((r) => ({
      date: new Date(r.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: r.value,
      status: r.status,
      flag: r.aiFlag,
    }));

  // For hypertension also show diastolic
  const diastolicReadings = program.type === "HYPERTENSION"
    ? (selectedEnrollment?.vitalReadings ?? [])
        .filter((r) => r.metricType === "DIASTOLIC_BP")
        .map((r) => ({
          date: new Date(r.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: r.value,
        }))
    : [];

  // Merge sys + dia for combined chart
  const combinedBPData = chartReadings.map((r, i) => ({
    ...r,
    diastolic: diastolicReadings[i]?.value ?? null,
  }));

  const criticalReadings = (selectedEnrollment?.vitalReadings ?? []).filter(r => r.status === "CRITICAL");
  const aiFlags = (selectedEnrollment?.vitalReadings ?? []).filter(r => r.aiFlag);
  const latestReading = (selectedEnrollment?.vitalReadings ?? [])
    .filter(r => r.metricType === primaryMetric)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];

  const trend = chartReadings.length >= 2
    ? chartReadings[chartReadings.length - 1].value - chartReadings[0].value
    : 0;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <Link href={`/chronic-care?clinicId=${clinicId}`} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Chronic Care Programs
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-white font-medium">{program.name}</span>
      </div>

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className={cn("rounded-2xl bg-gradient-to-br p-6 text-white shadow-xl", gradient.cls)}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              {program.type === "DIABETES" ? <Droplets className="h-7 w-7" /> : <Gauge className="h-7 w-7" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{program.name}</h1>
              <p className="text-sm opacity-80 mt-0.5">
                {program.enrollments.length} patients enrolled · {program.checkInFrequency.toLowerCase()} check-ins
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            {[
              { label: "Target",   value: `${program.targetMin}–${program.targetMax} ${program.unit}` },
              { label: "Critical", value: criticalReadings.length },
              { label: "AI Flags", value: aiFlags.length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 rounded-xl px-4 py-2.5 text-center">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs opacity-70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left: Patient Selector ──────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-3 max-h-[280px] lg:max-h-none overflow-y-auto lg:overflow-visible pr-1">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">Enrolled Patients</h3>
          {program.enrollments.map((enrollment) => {
            const isSelected = selectedEnrollment?.id === enrollment.id;
            const hasCritical = enrollment.vitalReadings.some(r => r.status === "CRITICAL");
            return (
              <button
                key={enrollment.id}
                id={`patient-${enrollment.id}`}
                onClick={() => setSelectedEnrollment(enrollment)}
                className={cn(
                  "w-full text-left bg-white dark:bg-slate-900 rounded-xl border p-3.5 transition-all duration-200",
                  isSelected
                    ? "border-teal-400 dark:border-teal-600 shadow-md shadow-teal-500/10 ring-1 ring-teal-400/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold shadow",
                    hasCritical ? "bg-rose-500" : "bg-teal-500"
                  )}>
                    {enrollment.patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{enrollment.patient.name}</p>
                    <p className={cn(
                      "text-xs font-medium mt-0.5",
                      enrollment.complianceScore >= 85 ? "text-emerald-600 dark:text-emerald-400" :
                      enrollment.complianceScore >= 65 ? "text-amber-600 dark:text-amber-400" :
                      "text-rose-600 dark:text-rose-400"
                    )}>
                      {enrollment.complianceScore}% compliance
                    </p>
                  </div>
                  {hasCritical && (
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 ml-auto animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Right: Vitals Detail ──────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-5">
          {selectedEnrollment ? (
            <>
              {/* Patient Profile Row */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-lg shadow-lg",
                      criticalReadings.length > 0 ? "bg-gradient-to-br from-rose-500 to-red-600" : "bg-gradient-to-br from-teal-500 to-emerald-600"
                    )}>
                      {selectedEnrollment.patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedEnrollment.patient.name}</h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{selectedEnrollment.patient.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{selectedEnrollment.patient.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Latest Reading Badge */}
                  {latestReading && (() => {
                    const cfg = getReadingStatusConfig(latestReading.status);
                    return (
                      <div className={cn("flex flex-col items-center px-5 py-3 rounded-xl border w-full sm:w-auto", cfg.bg, cfg.border)}>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{latestReading.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{latestReading.unit}</p>
                        <span className={cn("text-xs font-semibold mt-1", cfg.text)}>{cfg.label}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {[
                    { label: "Enrolled",      value: new Date(selectedEnrollment.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), icon: Calendar },
                    { label: "Compliance",    value: `${selectedEnrollment.complianceScore}%`, icon: Shield },
                    { label: "Total Readings", value: selectedEnrollment.vitalReadings.filter(r => r.metricType === primaryMetric).length, icon: Activity },
                    { label: "Critical Count", value: criticalReadings.length, icon: AlertTriangle },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Icon className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Vitals Trend Chart ──────────────────────────────────────── */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {program.type === "HYPERTENSION" ? "Blood Pressure Trend" : "Glucose Trend"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Green zone = target range ({program.targetMin}–{program.targetMax} {program.unit})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {trend !== 0 && (
                      <span className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                        trend < 0
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      )}>
                        {trend < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                        {Math.abs(trend).toFixed(0)} {program.unit} overall
                      </span>
                    )}
                  </div>
                </div>

                {chartReadings.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={program.type === "HYPERTENSION" ? combinedBPData : chartReadings} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="vitalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColor.fill} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={chartColor.fill} stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="diaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip targetMin={program.targetMin} targetMax={program.targetMax} unit={program.unit} />} />
                      {/* Target range band */}
                      <ReferenceLine y={program.targetMax} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: `Max ${program.targetMax}`, fill: "#22c55e", fontSize: 10, position: "right" }} />
                      <ReferenceLine y={program.targetMin} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: `Min ${program.targetMin}`, fill: "#22c55e", fontSize: 10, position: "right" }} />
                      <Area
                        type="monotone" dataKey="value" stroke={chartColor.stroke} strokeWidth={2.5}
                        fill="url(#vitalGrad)" dot={{ fill: chartColor.stroke, r: 4, strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                      />
                      {program.type === "HYPERTENSION" && (
                        <Area
                          type="monotone" dataKey="diastolic" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 3"
                          fill="url(#diaGrad)" dot={{ fill: "#f43f5e", r: 3, strokeWidth: 1.5, stroke: "#fff" }}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[260px] text-slate-400 dark:text-slate-500">
                    <div className="text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No readings recorded yet</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── AI Flags & Reading History ──────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* AI Observations */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Clinical Observations</h3>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold dark:bg-violet-900/30 dark:text-violet-400">
                      {aiFlags.length} flags
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {aiFlags.slice().reverse().map((reading) => {
                      const cfg = getReadingStatusConfig(reading.status);
                      return (
                        <div key={reading.id} className={cn("p-3 rounded-xl border text-xs", cfg.bg, cfg.border)}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn("font-semibold flex items-center gap-1", cfg.text)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                              {reading.value} {reading.unit} · {cfg.label}
                            </span>
                            <span className="text-slate-400">
                              {new Date(reading.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{reading.aiFlag}</p>
                        </div>
                      );
                    })}
                    {aiFlags.length === 0 && (
                      <div className="flex items-center justify-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" />
                        No AI flags — readings within normal patterns
                      </div>
                    )}
                  </div>
                </div>

                {/* Reading History Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-4 w-4 text-teal-500" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Reading History</h3>
                  </div>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {(selectedEnrollment?.vitalReadings ?? [])
                      .filter(r => r.metricType === primaryMetric)
                      .slice()
                      .reverse()
                      .map((reading) => {
                        const cfg = getReadingStatusConfig(reading.status);
                        return (
                          <div key={reading.id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                            <div className="flex items-center gap-2.5">
                              <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">{reading.value} <span className="text-xs font-normal text-slate-400">{reading.unit}</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={cn("text-xs font-medium", cfg.text)}>{cfg.label}</span>
                              <span className="text-xs text-slate-400">
                                {new Date(reading.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Enrollment Notes */}
              {selectedEnrollment.notes && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Care Coordinator Notes</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedEnrollment.notes}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <User className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Select a patient to view their vitals</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
