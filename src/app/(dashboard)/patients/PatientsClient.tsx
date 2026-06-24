"use client";

import { useState, useTransition } from "react";
import {
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  ClipboardList,
  MessageCircle,
  Plus,
  CheckCircle2,
  Bookmark,
  Users,
  Compass,
  FileHeart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { assignCarePlan } from "@/lib/db-actions";
import Link from "next/link";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  status: string;
  healthEngagementScore: number;
  predictiveRiskScore: number;
  riskReasons: string; // JSON String
  communicationPreference: string;
  detailPreference: string;
  memoryNotes: string;
  createdAt: Date;
  visits: Array<{
    id: string;
    date: Date;
    diagnosis: string;
    treatment: string;
    notes: string;
    instructions: string;
    doctor: {
      user: {
        name: string;
      };
    };
  }>;
  followUps: Array<{
    id: string;
    title: string;
    status: string;
    scheduledDate: Date;
    sentAt: Date | null;
    messages: Array<{
      id: string;
      sender: string;
      content: string;
      sentAt: Date;
    }>;
    responses: Array<{
      id: string;
      responseText: string;
      sentiment: string;
      riskScore: number;
      respondedAt: Date;
    }>;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
  }>;
}

interface PatientsClientProps {
  clinicId: string;
  patients: Patient[];
  carePlans: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  selectedPatientIdFromQuery?: string;
}

export default function PatientsClient({
  clinicId,
  patients,
  carePlans,
  selectedPatientIdFromQuery
}: PatientsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    selectedPatientIdFromQuery || patients[0]?.id || ""
  );
  const [isPending, startTransition] = useTransition();
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [message, setMessage] = useState("");

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Filtering patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "HIGHRISK" && p.status === "HighRisk") ||
      (statusFilter === "ACTIVE" && p.status === "Active") ||
      (statusFilter === "DISCHARGED" && p.status === "Discharged");

    return matchesSearch && matchesStatus;
  });

  const handleAssignPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !selectedPatient) return;

    startTransition(async () => {
      const res = await assignCarePlan(selectedPatient.id, selectedPlanId);
      if (res.success) {
        setMessage("Care Journey assigned successfully!");
        setSelectedPlanId("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error assigning care plan.");
      }
    });
  };

  const getAge = (birthDateString: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper to parse JSON reasons
  const parseRiskReasons = (jsonStr: string): string[] => {
    try {
      return JSON.parse(jsonStr) || [];
    } catch {
      return [];
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {/* Left Column: Patients List */}
      <div className="lg:col-span-1 space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs outline-none focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-teal-500 transition-all text-slate-700"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ACTIVE", "HIGHRISK", "DISCHARGED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                  statusFilter === status
                    ? "bg-teal-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {status === "HIGHRISK" ? "High Risk" : status.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Cards List */}
        <div className="space-y-3 overflow-y-auto max-h-[300px] lg:max-h-[650px] pr-1">
          {filteredPatients.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              No patients found matching criteria.
            </p>
          ) : (
            filteredPatients.map((patient) => {
              const riskPercent = Math.round(patient.predictiveRiskScore * 100);
              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full text-left rounded-xl p-4 border transition-all duration-150 flex items-center justify-between gap-4 ${
                    selectedPatient?.id === patient.id
                      ? "border-teal-500 bg-teal-500/5 dark:bg-teal-500/10 shadow-sm shadow-teal-500/5"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs uppercase ${
                      patient.status === "HighRisk"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {patient.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 truncate">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {patient.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Risk: {riskPercent}% • Score: {patient.healthEngagementScore}/100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {patient.status === "HighRisk" && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white animate-pulse">
                        <AlertTriangle className="h-2.5 w-2.5" />
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-650" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right 3 Columns: Selected Patient Detail Workspace */}
      <div className="lg:col-span-2 xl:col-span-3">
        {selectedPatient ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all space-y-6">
            
            {/* Header profile banner */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedPatient.name}
                    </h2>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      selectedPatient.status === "HighRisk"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    }`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-505 text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> DOB: {selectedPatient.birthDate} ({getAge(selectedPatient.birthDate)} yrs)</span>
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {selectedPatient.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {selectedPatient.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/messages?clinicId=${clinicId}&patientId=${selectedPatient.id}`}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-teal-500" />
                  Intervene in Chat
                </Link>
              </div>
            </div>

            {/* Key Clinical Insights (AI Engagement + Predictive Risk + Memory Notes) */}
            <div className="px-6 grid gap-6 grid-cols-1 md:grid-cols-3">
              {/* Widget 1: Engagement Score Gauge */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/20 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FileHeart className="h-3.5 w-3.5 text-teal-500" />
                  AI Engagement Rating
                </h4>
                <div className="flex items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-slate-105 border-t-teal-500 text-sm font-black text-slate-900 dark:text-white dark:border-slate-800">
                    {selectedPatient.healthEngagementScore}%
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal space-y-1">
                    <span className="font-bold text-emerald-500 block">✓ Responds promptly</span>
                    <span className="font-bold text-slate-400 block">✓ Completed checkout</span>
                    {selectedPatient.healthEngagementScore < 60 && (
                      <span className="font-bold text-rose-500 block">⚠️ Missed scheduled check-ins</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Widget 2: Predictive Risk Score Panel */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/20 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                  Predictive Patient Risk
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${selectedPatient.predictiveRiskScore > 0.6 ? "text-rose-500" : selectedPatient.predictiveRiskScore > 0.3 ? "text-amber-500" : "text-emerald-500"}`}>
                      {selectedPatient.predictiveRiskScore > 0.6 ? "High Risk" : selectedPatient.predictiveRiskScore > 0.3 ? "Moderate Risk" : "Low Risk"}
                    </span>
                    <span className="font-black text-slate-850 dark:text-slate-100">
                      {Math.round(selectedPatient.predictiveRiskScore * 100)}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    {parseRiskReasons(selectedPatient.riskReasons).length === 0 ? (
                      <span className="text-[9px] text-slate-400 italic block">No contributing risk reasons identified by AI.</span>
                    ) : (
                      parseRiskReasons(selectedPatient.riskReasons).map((reason, i) => (
                        <span key={i} className="text-[9px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                          {reason}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Widget 3: Patient Memory System Profile */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/20 space-y-2 text-xs">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5 text-indigo-500" />
                  SaaS Memory Notes & Preferences
                </h4>
                <div className="space-y-1">
                  <p><strong className="text-slate-500">Preferred Channel:</strong> {selectedPatient.communicationPreference} ({selectedPatient.detailPreference} details)</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 italic leading-relaxed pt-1.5 border-t border-slate-200 dark:border-slate-800">
                    &ldquo;{selectedPatient.memoryNotes || "No previous memory logs documented."}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Layout Inner Grid: Timelines & Schedulers */}
            <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-6">
              
              {/* Left Column: Visual Timelines */}
              <div className="space-y-6">
                
                {/* Advanced Differentiator: Visual Recovery Journey */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-1.5">
                    <Compass className="h-4.5 w-4.5 text-teal-500" />
                    Patient Health Timeline (Recovery Progress)
                  </h3>
                  
                  {/* Timeline Nodes */}
                  <div className="flex items-start justify-between gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
                    {/* Node 1 */}
                    <div className="flex flex-col items-center gap-2 text-center text-[9px] font-bold shrink-0 w-20 sm:w-24">
                      <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
                      <span className="text-slate-700 dark:text-slate-300">Checkout Completed</span>
                    </div>
                    {/* Node 2 */}
                    <div className="flex flex-col items-center gap-2 text-center text-[9px] font-bold shrink-0 w-20 sm:w-24">
                      <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
                      <span className="text-slate-700 dark:text-slate-300">AI Plan Active</span>
                    </div>
                    {/* Node 3 */}
                    <div className="flex flex-col items-center gap-2 text-center text-[9px] font-bold shrink-0 w-20 sm:w-24">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${
                        selectedPatient.followUps.some(f => f.status === "Completed")
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {selectedPatient.followUps.some(f => f.status === "Completed") ? "✓" : "3"}
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">Outreach Check-in</span>
                    </div>
                    {/* Node 4 */}
                    <div className="flex flex-col items-center gap-2 text-center text-[9px] font-bold shrink-0 w-20 sm:w-24">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${
                        selectedPatient.status === "HighRisk"
                          ? "bg-rose-500 text-white animate-pulse"
                          : selectedPatient.status === "Discharged"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-655 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {selectedPatient.status === "HighRisk" ? "⚠️" : "4"}
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">Triage Analysis</span>
                    </div>
                    {/* Node 5 */}
                    <div className="flex flex-col items-center gap-2 text-center text-[9px] font-bold shrink-0 w-20 sm:w-24">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${
                        selectedPatient.status === "Discharged"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-650 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {selectedPatient.status === "Discharged" ? "✓" : "5"}
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">Cohort Discharge</span>
                    </div>
                  </div>
                </div>

                {/* Visit History Detail Cards */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Diagnostic Guidelines History
                  </h4>
                  {selectedPatient.visits.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4">No diagnostic summaries available.</p>
                  ) : (
                    selectedPatient.visits.map((visit) => (
                      <div key={visit.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-850 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {visit.treatment}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(visit.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <p><strong className="text-slate-500">Diagnosis:</strong> {visit.diagnosis}</p>
                          <p><strong className="text-slate-500">Physician:</strong> {visit.doctor.user.name}</p>
                          <div className="mt-3 bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 rounded-lg p-3">
                            <h4 className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI Care Guidelines
                            </h4>
                            <p className="text-slate-800 dark:text-slate-350 italic leading-relaxed">
                              {visit.instructions}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Activation plan template scheduler form */}
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/30">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 mb-2">
                    Activate Continuity Care Journey
                  </h4>
                  <form onSubmit={handleAssignPlan} className="space-y-3">
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500"
                    >
                      <option value="">-- Choose a Care Journey Template --</option>
                      {carePlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={isPending || !selectedPlanId}
                      className="w-full flex items-center justify-center gap-1.5 bg-teal-500 text-white rounded-lg py-2 text-xs font-semibold hover:bg-teal-600 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Assign Care Plan
                    </button>
                  </form>
                  {message && (
                    <p className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 mt-2 text-center">
                      {message}
                    </p>
                  )}
                </div>

              </div>

              {/* Right Column: Complete Follow-up timeline checks */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="h-4.5 w-4.5 text-teal-500" />
                  Follow-Up Check-In Timeline
                </h3>

                <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
                  {[...selectedPatient.followUps]
                    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                    .map((item) => {
                      const statusColors =
                        item.status === "Completed"
                          ? "bg-emerald-500 text-white"
                          : item.status === "Escalated"
                          ? "bg-rose-500 text-white"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500";

                      const isToday = new Date(item.scheduledDate).toDateString() === new Date().toDateString();

                      return (
                        <div key={item.id} className="relative">
                          {/* Dot indicator */}
                          <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ring-4 ring-white dark:ring-slate-950 ${statusColors}`}>
                            {item.status === "Completed" ? (
                              <CheckCircle className="h-3.5 w-3.5" />
                            ) : item.status === "Escalated" ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </span>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">
                                {item.title}
                              </h4>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                item.status === "Completed"
                                  ? "bg-emerald-55 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                  : item.status === "Escalated"
                                  ? "bg-rose-55 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 animate-pulse"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Scheduled: {new Date(item.scheduledDate).toLocaleDateString()} {isToday && "(Today)"}
                            </p>

                            {/* Outreach logs */}
                            {item.messages.length > 0 && (
                              <div className="mt-2 text-xs text-slate-600 dark:text-slate-450 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-lg p-2.5 space-y-2">
                                {item.messages.map((msg) => (
                                  <div key={msg.id} className="leading-relaxed">
                                    <span className="font-semibold text-slate-800 dark:text-slate-350">
                                      {msg.sender === "AI" ? "AI Bot" : "Patient"}:
                                    </span>{" "}
                                    {msg.content}
                                  </div>
                                ))}

                                {/* Triage evaluations */}
                                {item.responses.map((resp) => (
                                  <div 
                                    key={resp.id} 
                                    className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] flex items-center justify-between"
                                  >
                                    <span className="text-slate-400">
                                      NLP Risk Evaluation:
                                    </span>
                                    <span className={`font-extrabold px-1.5 py-0.2 rounded uppercase ${
                                      resp.sentiment === "Alert"
                                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                                        : resp.sentiment === "Positive"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                                    }`}>
                                      {resp.sentiment} ({Math.round(resp.riskScore * 100)}% risk)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 min-h-[500px]">
            <User className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">No Patient Selected</p>
            <p className="text-xs text-slate-500 mt-1">Select a patient on the left to view profile history and care timelines.</p>
          </div>
        )}
      </div>
    </div>
  );
}
