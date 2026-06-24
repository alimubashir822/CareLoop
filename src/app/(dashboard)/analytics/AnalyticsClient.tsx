"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  AlertOctagon,
  CalendarCheck2,
  Users,
  Building,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

interface MonthData {
  month: string;
  responseRate: number;
  symptomAlerts: number;
  appointmentsRecovered: number;
  activePatients: number;
}

interface AnalyticsClientProps {
  clinicId: string;
  data: MonthData[];
}

export default function AnalyticsClient({ clinicId, data }: AnalyticsClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500"></div>
      </div>
    );
  }

  // Calculate totals and averages
  const avgResponseRate = Math.round(data.reduce((acc, curr) => acc + curr.responseRate, 0) / data.length);
  const totalAlerts = data.reduce((acc, curr) => acc + curr.symptomAlerts, 0);
  const totalRecovered = data.reduce((acc, curr) => acc + curr.appointmentsRecovered, 0);
  const currentActive = data[data.length - 1]?.activePatients || 0;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Historical analysis of patient outreach engagement, clinical risk indicators, and appointment recoveries.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Response Rate
            </span>
            <div className="rounded-lg bg-teal-500/10 p-2 text-teal-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {avgResponseRate}%
            </span>
            <span className="text-[10px] text-teal-500 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +4.2%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Symptom Alerts
            </span>
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-500">
              <AlertOctagon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {totalAlerts}
            </span>
            <span className="text-[10px] text-slate-400">past 6 months</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Reschedules Recovered
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {totalRecovered}
            </span>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +18%
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Enrolled Patients
            </span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {currentActive}
            </span>
            <span className="text-[10px] text-slate-400">currently active</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Chart 1: Response Rate Trend */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Patient Response Triage Rate (%)
            </h3>
            <p className="text-[10px] text-slate-400">Monthly breakdown of text check-in replies.</p>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-105 dark:stroke-slate-800" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  itemStyle={{ color: "#14b8a6" }}
                />
                <Area type="monotone" dataKey="responseRate" name="Response Rate (%)" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Missed Appointment Reschedules */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Missed Appointment Recoveries
            </h3>
            <p className="text-[10px] text-slate-400">Reschedules automated and confirmed by AI engine.</p>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-105 dark:stroke-slate-800" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Bar dataKey="appointmentsRecovered" name="Rescheduled Appointments" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Alert Volume */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Monthly Critical Symptom Alerts
            </h3>
            <p className="text-[10px] text-slate-400">Total high-risk notifications escalated to clinical staff.</p>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-105 dark:stroke-slate-800" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  itemStyle={{ color: "#f43f5e" }}
                />
                <Line type="monotone" dataKey="symptomAlerts" name="High Risk Alerts" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Active Patient Enrollment */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Active Care Continuity Enrollments
            </h3>
            <p className="text-[10px] text-slate-400">Patient cohorts monitored actively in standard journeys.</p>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-105 dark:stroke-slate-800" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  itemStyle={{ color: "#6366f1" }}
                />
                <Area type="monotone" dataKey="activePatients" name="Enrolled Patients" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
