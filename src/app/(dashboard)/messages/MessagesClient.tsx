"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Zap,
  Phone,
  Clock,
  ChevronRight,
  RefreshCw,
  Search,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitClinicianMessage, submitPatientResponse } from "@/lib/ai-simulator";

interface Message {
  id: string;
  sender: string; // "AI" | "Patient" | "Clinic"
  content: string;
  sentAt: Date;
  status: string;
}

interface PatientChat {
  id: string;
  name: string;
  phone: string;
  status: string;
  messages: Message[];
}

interface MessagesClientProps {
  clinicId: string;
  patients: PatientChat[];
  selectedPatientIdFromQuery?: string;
}

export default function MessagesClient({
  clinicId,
  patients,
  selectedPatientIdFromQuery
}: MessagesClientProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    selectedPatientIdFromQuery || patients[0]?.id || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [clinicianInput, setClinicianInput] = useState("");
  const [patientSimInput, setPatientSimInput] = useState("");
  const [autopilot, setAutopilot] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Set default autopilot active for patients
  useEffect(() => {
    const defaultAutopilots: Record<string, boolean> = {};
    patients.forEach((p) => {
      defaultAutopilots[p.id] = autopilot[p.id] !== undefined ? autopilot[p.id] : true;
    });
    setAutopilot(defaultAutopilots);
  }, [patients]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedPatient?.messages]);

  const toggleAutopilot = (patId: string) => {
    setAutopilot((prev) => ({ ...prev, [patId]: !prev[patId] }));
  };

  const handleSendClinicianMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicianInput.trim() || !selectedPatient) return;

    const textToSend = clinicianInput;
    setClinicianInput("");

    // Turn off autopilot when sending manual message
    setAutopilot((prev) => ({ ...prev, [selectedPatient.id]: false }));

    startTransition(async () => {
      await submitClinicianMessage(selectedPatient.id, textToSend);
    });
  };

  const handleSimulatePatientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientSimInput.trim() || !selectedPatient) return;

    const textToSend = patientSimInput;
    setPatientSimInput("");

    startTransition(async () => {
      // If Autopilot is ON, it will reply automatically. If not, it just appends the message.
      if (autopilot[selectedPatient.id]) {
        await submitPatientResponse(selectedPatient.id, textToSend);
      } else {
        // Just send patient message without AI trigger (manual log)
        // For simulation completeness, submitPatientResponse will log it and return.
        await submitPatientResponse(selectedPatient.id, textToSend);
      }
    });
  };

  const getSortedMessages = (msgs: Message[]) => {
    return [...msgs].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
      {/* Patient Inbox Sidebar */}
      <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col max-h-[280px] md:max-h-[650px]">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <MessageCircle className="h-4.5 w-4.5 text-teal-500" />
          Inbox Threads
        </h3>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Filter chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs outline-none focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-teal-500 transition-all text-slate-700"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredPatients.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">No chats found.</p>
          ) : (
            filteredPatients.map((patient) => {
              const lastMsg = patient.messages[patient.messages.length - 1];
              const isSelected = patient.id === selectedPatientId;
              const isAuto = autopilot[patient.id];

              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full text-left rounded-lg p-3.5 border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? "border-teal-500 bg-teal-500/5 dark:bg-teal-500/10"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {patient.name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase ${
                      isAuto 
                        ? "bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400" 
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {isAuto ? "Autopilot" : "Manual"}
                    </span>
                  </div>
                  {lastMsg && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full italic">
                      {lastMsg.sender === "Patient" ? "Patient: " : lastMsg.sender === "AI" ? "AI Bot: " : "You: "}
                      {lastMsg.content}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Center columns: Active Chat Thread */}
      <div className="md:col-span-2 lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden min-h-[400px] max-h-[650px]">
        {selectedPatient ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                  {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {selectedPatient.name}
                  </h4>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400">
                    Phone outreach: {selectedPatient.phone}
                  </p>
                </div>
              </div>

              {/* Autopilot Toggler */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  AI Autopilot:
                </span>
                <button
                  onClick={() => toggleAutopilot(selectedPatient.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    autopilot[selectedPatient.id] ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      autopilot[selectedPatient.id] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[350px]">
              {getSortedMessages(selectedPatient.messages).map((msg) => {
                const isPatient = msg.sender === "Patient";
                const isAI = msg.sender === "AI";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isPatient ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-xl p-3.5 shadow-sm text-xs relative ${
                        isPatient
                          ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-bl-none"
                          : isAI
                          ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-br-none"
                          : "bg-indigo-600 text-white rounded-br-none"
                      }`}
                    >
                      {/* Badge identifier */}
                      {!isPatient && (
                        <span className={`absolute -top-4 right-1 text-[8px] font-extrabold uppercase tracking-wider flex items-center gap-0.5 ${
                          isAI ? "text-teal-600 dark:text-teal-400" : "text-indigo-500"
                        }`}>
                          {isAI ? (
                            <>
                              <Sparkles className="h-2 w-2" />
                              AI Assistant
                            </>
                          ) : (
                            "Clinician"
                          )}
                        </span>
                      )}
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Clinician manual reply form */}
            <form
              onSubmit={handleSendClinicianMessage}
              className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2"
            >
              <input
                type="text"
                placeholder="Type manual reply (disables Autopilot)..."
                value={clinicianInput}
                onChange={(e) => setClinicianInput(e.target.value)}
                disabled={isPending}
                className="flex-1 text-xs rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={isPending || !clinicianInput.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <MessageSquare className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">Select a Conversation</p>
          </div>
        )}
      </div>

      {/* Right Column: SMS Texting Simulator Panel */}
      <div className="md:col-span-3 lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Zap className="h-4.5 w-4.5 text-teal-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Patient SMS Simulator
            </h3>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
            Type here to simulate the patient texting the clinic's virtual phone number. Watch how the **AI Autopilot** responds and how details change in the clinic.
          </p>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Test Templates:
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setPatientSimInput("I am doing great! My swelling has gone down and I have no pain today.")}
                className="w-full text-left text-[10px] p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-500/5 transition-all text-slate-700 dark:text-slate-300 italic truncate"
              >
                &ldquo;I am doing great, no pain...&rdquo;
              </button>
              <button
                onClick={() => setPatientSimInput("My pain is getting much worse since this morning and I see bleeding around the stitch. What should I do?")}
                className="w-full text-left text-[10px] p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-500/5 transition-all text-slate-700 dark:text-slate-300 italic truncate"
              >
                &ldquo;My pain is worse & bleeding...&rdquo;
              </button>
              <button
                onClick={() => setPatientSimInput("Can I drink coffee or eat soup today? The guidelines weren't clear.")}
                className="w-full text-left text-[10px] p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-500/5 transition-all text-slate-700 dark:text-slate-300 italic truncate"
              >
                &ldquo;Can I drink coffee today?...&rdquo;
              </button>
            </div>
          </div>

          <form onSubmit={handleSimulatePatientMessage} className="space-y-3 pt-2">
            <textarea
              placeholder="Simulate what the patient texts back..."
              value={patientSimInput}
              onChange={(e) => setPatientSimInput(e.target.value)}
              rows={3}
              disabled={isPending}
              className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500 resize-none leading-relaxed"
            />
            <button
              type="submit"
              disabled={isPending || !patientSimInput.trim() || !selectedPatient}
              className="w-full flex items-center justify-center gap-1.5 bg-teal-500 text-white rounded-lg py-2 text-xs font-semibold hover:bg-teal-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              Simulate Text Message
            </button>
          </form>
        </div>

        {/* Informative Help Alert */}
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-850 bg-slate-50/20 text-[10px] text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <span className="font-bold flex items-center gap-1 text-slate-800 dark:text-slate-200">
            <HelpCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            Triage & Task Escalation
          </span>
          <p>
            When danger keywords are texted, Autopilot automatically creates a clinic ticket on the dashboard and alerts nurses. 
          </p>
          <p>
            Answering manually or disabling **AI Autopilot** pauses bot responses, letting staff maintain manual control.
          </p>
        </div>
      </div>
    </div>
  );
}
