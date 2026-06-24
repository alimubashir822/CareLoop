"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  MessageCircle,
  Activity,
  Calendar,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Wifi,
  Battery,
  Mic,
  MicOff,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitPatientResponse } from "@/lib/ai-simulator";

interface PortalClientProps {
  patient: {
    id: string;
    name: string;
    phone: string;
    status: string;
    visits: Array<{
      id: string;
      treatment: string;
      instructions: string;
    }>;
    messages: Array<{
      id: string;
      sender: string;
      content: string;
      sentAt: Date;
    }>;
    appointments: Array<{
      id: string;
      scheduledAt: Date;
      status: string;
      type: string;
    }>;
  };
}

export default function PortalClient({ patient }: PortalClientProps) {
  const [activeTab, setActiveTab] = useState<"instructions" | "chat" | "appointments">("instructions");
  const [messages, setMessages] = useState(patient.messages);
  const [chatInput, setChatInput] = useState("");
  const [isPending, startTransition] = useTransition();
  
  // Custom checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Custom booking state
  const [bookedStatus, setBookedStatus] = useState(false);
  const [bookingDate, setBookingDate] = useState("");

  // Voice recording simulator states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceToast, setVoiceToast] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Parse lines of instructions into checklist
  const instructionLines = patient.visits[0]?.instructions
    ? patient.visits[0].instructions.split(". ").filter(l => l.trim().length > 0)
    : [
        "Avoid hard or hot foods for 3 days",
        "Rinse gently with warm salt water after 24 hours",
        "Take prescribed medications as scheduled",
        "Contact clinic if pain or swelling increases"
      ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendSMS = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append patient message locally instantly for optimal UI response
    const localPatientMsg = {
      id: Math.random().toString(),
      sender: "Patient",
      content: textToSend,
      sentAt: new Date()
    };
    setMessages(prev => [...prev, localPatientMsg]);

    startTransition(async () => {
      const res = await submitPatientResponse(patient.id, textToSend);
      if (res && res.success && res.aiMessage) {
        const localAiMsg = {
          id: res.aiMessage.id,
          sender: res.aiMessage.sender,
          content: res.aiMessage.content,
          sentAt: new Date(res.aiMessage.sentAt)
        };
        setMessages(prev => [...prev, localAiMsg]);
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput("");
    handleSendSMS(text);
  };

  // Click microphone to simulate speech transcribing
  const handleSimulateVoice = () => {
    if (isRecording) return;
    setIsRecording(true);
    setVoiceToast("Recording voice... Speak now.");
    
    // Simulate recording for 2.5 seconds, then transcribe
    setTimeout(() => {
      const simulatedTranscriptions = [
        "I'm feeling much better today, but I still have some swelling in my cheek.",
        "My pain is getting worse since this morning and I see some bleeding around the stitches.",
        "Can I eat soup or hot foods today?",
      ];
      
      const idx = Math.floor(Math.random() * simulatedTranscriptions.length);
      const transcribedText = simulatedTranscriptions[idx];
      
      setChatInput(transcribedText);
      setIsRecording(false);
      setVoiceToast("Speech-to-Text: Transcribed voice successfully!");
      
      setTimeout(() => setVoiceToast(""), 3000);
    }, 2500);
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) return;
    setBookedStatus(true);
    setTimeout(() => {
      setBookedStatus(false);
      setBookingDate("");
    }, 4000);
  };

  // Sort messages
  const sortedMessages = [...messages].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-4 relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Page Title for Context */}
      <div className="text-center mb-6 z-10 max-w-sm">
        <h1 className="text-lg font-bold text-slate-350 flex items-center justify-center gap-1.5">
          <Activity className="h-4.5 w-4.5 text-teal-400 animate-pulse" />
          CareLoop Patient Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Simulated smartphone view. Switch tabs below to view recovery instructions or test the **AI Autopilot chat FAQs** and **Voice Assistant**.
        </p>
      </div>

      {/* MOBILE DEVICE MOCKUP FRAME */}
      <div className="relative mx-auto w-[360px] h-[720px] rounded-[48px] border-[14px] border-slate-950 bg-slate-950 shadow-2xl shadow-teal-500/5 ring-4 ring-slate-800 z-10 overflow-hidden flex flex-col justify-between origin-center scale-[0.85] sm:scale-100 my-[-45px] sm:my-0">
        
        {/* Device Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-12 h-1.5 bg-slate-800 rounded-full mb-1"></div>
        </div>

        {/* Mobile Screen Status Bar */}
        <div className="h-10 px-6 pt-3 flex items-center justify-between text-[10px] font-bold text-slate-450 bg-slate-900/60 z-20 shrink-0">
          <span>10:30 AM</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3 w-3" />
            <span className="text-[8px] uppercase">5G</span>
            <Battery className="h-3 w-3" />
          </div>
        </div>

        {/* Dynamic App Content Wrapper */}
        <div className="flex-1 bg-slate-950 flex flex-col justify-between overflow-hidden relative">
          
          {/* Header Panel */}
          <div className="px-5 py-4 border-b border-slate-900 bg-slate-900/85 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-teal-500/10">
                SC
              </div>
              <div>
                <span className="font-bold tracking-tight text-xs text-slate-200">
                  CareLoop Health Assistant
                </span>
                <p className="text-[8px] text-slate-400">HIPAA Protected Sandbox</p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Connected to Clinic"></div>
          </div>

          {/* Active Tab Scroll Workspace */}
          <div className="flex-1 overflow-y-auto p-4 relative">
            
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Instructions/Recovery Checklist */}
              {activeTab === "instructions" && (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Active Recovery Protocol
                    </h3>
                    <p className="text-sm font-extrabold text-white mt-1">
                      {patient.visits[0]?.treatment || "Post-Surgery Care"}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Doctor's Care Checklist
                    </h4>
                    {instructionLines.map((line, idx) => {
                      const isChecked = !!checkedItems[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleCheck(idx)}
                          className={`w-full text-left flex items-start gap-3 rounded-xl p-3.5 border transition-all ${
                            isChecked
                              ? "bg-teal-500/10 border-teal-500/20 text-slate-350"
                              : "bg-slate-900/50 border-slate-850 text-slate-200 hover:border-slate-800"
                          }`}
                        >
                          <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isChecked ? "bg-teal-500 border-teal-500 text-white" : "border-slate-700 bg-slate-950"
                          }`}>
                            {isChecked && <CheckCircle2 className="h-3 w-3 fill-current" />}
                          </span>
                          <span className={`text-xs ${isChecked && "line-through text-slate-500"}`}>
                            {line}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Warning banner */}
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex gap-3 text-xs text-rose-450 leading-relaxed">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                    <div>
                      <span className="font-bold">Urgent Warning:</span> If you experience severe bleeding, escalating pain unmanaged by meds, or fever above 101°F, please chat with the AI or call us.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: AI Assistant Conversation */}
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col h-full justify-between"
                >
                  <div className="space-y-4 pb-28">
                    {/* Intro Bot Greeting */}
                    <div className="rounded-xl bg-slate-900/80 border border-slate-850 p-3 text-xs text-slate-400 flex items-start gap-2.5">
                      <Sparkles className="h-4 w-4 text-teal-400 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span className="font-semibold text-slate-300">AI Assistant Autopilot</span>
                        <p className="mt-0.5">Hi {patient.name.split(" ")[0]}! Ask me questions like <em>"can I shower?"</em>, <em>"can I exercise?"</em>, or update me on how you are feeling.</p>
                      </div>
                    </div>

                    {/* Messages feed */}
                    {sortedMessages.map((msg) => {
                      const isPatient = msg.sender === "Patient";
                      return (
                        <div key={msg.id} className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[240px] rounded-2xl px-3.5 py-2 text-xs relative leading-relaxed ${
                            isPatient
                              ? "bg-teal-500 text-slate-950 font-medium rounded-br-none"
                              : "bg-slate-900 text-slate-200 rounded-bl-none"
                          }`}>
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Messaging Text Area Input Footer & FAQ pills */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950 border-t border-slate-900 space-y-2.5 z-10">
                    
                    {/* FAQ Suggestion Pills (Medical FAQs) */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      <button
                        onClick={() => handleSendSMS("Can I shower?")}
                        className="shrink-0 text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full border border-slate-800 transition-colors"
                      >
                        Can I shower?
                      </button>
                      <button
                        onClick={() => handleSendSMS("Can I exercise?")}
                        className="shrink-0 text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full border border-slate-800 transition-colors"
                      >
                        Can I exercise?
                      </button>
                      <button
                        onClick={() => handleSendSMS("What can I eat?")}
                        className="shrink-0 text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full border border-slate-800 transition-colors"
                      >
                        What can I eat?
                      </button>
                    </div>

                    {/* Speech transcriber indicator toast */}
                    {voiceToast && (
                      <div className="text-[9px] text-teal-400 font-bold flex items-center gap-1 px-1">
                        <Volume2 className="h-3 w-3 animate-bounce" />
                        {voiceToast}
                      </div>
                    )}

                    {/* Text box input & Voice Button */}
                    <form onSubmit={handleFormSubmit} className="flex gap-2">
                      {/* Voice Microphone Simulator button */}
                      <button
                        type="button"
                        onClick={handleSimulateVoice}
                        disabled={isPending}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isRecording 
                            ? "bg-rose-500 border-rose-500 text-white animate-pulse" 
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                        title="Simulate Voice Input"
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      
                      <input
                        type="text"
                        placeholder={isRecording ? "Listening..." : "Ask AI or check-in..."}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={isPending || isRecording}
                        className="flex-1 text-xs rounded-full border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none text-slate-200 focus:border-teal-500 transition-all placeholder:text-slate-650"
                      />
                      <button
                        type="submit"
                        disabled={isPending || isRecording || !chatInput.trim()}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors shadow-lg disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Appointment Booking */}
              {activeTab === "appointments" && (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-teal-400" />
                      Appointments
                    </h3>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-850 pb-2">
                        <span className="text-slate-400 font-medium">Follow-Up Cleaning</span>
                        <span className="text-slate-200">Pending Schedule</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Suggested: Day 30 post-op visit</p>
                    </div>
                  </div>

                  {bookedStatus ? (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center text-xs text-emerald-400 space-y-1"
                    >
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                      <p className="font-bold">Reschedule Requested!</p>
                      <p className="text-[10px] text-slate-400 leading-normal">Our staff is syncing this to our scheduling grid and will confirm via SMS shortly.</p>
                    </motion.div>
                  ) : (
                    <div className="rounded-xl border border-slate-850 bg-slate-900/30 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-white">Book Follow-Up Check-Up</h4>
                      <p className="text-[10px] text-slate-500">Pick a convenient slot to request booking sync.</p>
                      <form onSubmit={handleBookAppointment} className="space-y-3">
                        <input
                          type="datetime-local"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-800 bg-slate-950 p-2.5 outline-none text-slate-200 focus:border-teal-500"
                        />
                        <button
                          type="submit"
                          disabled={!bookingDate}
                          className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 rounded-lg py-2.5 text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          Request Reschedule Slot
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-850 p-4 text-xs text-slate-400 text-center flex flex-col items-center justify-center gap-2">
                    <PhoneCall className="h-4 w-4 text-teal-400" />
                    <div>
                      <p className="font-semibold text-slate-350">Need Immediate Help?</p>
                      <a href="tel:+15550000" className="text-teal-400 font-bold hover:underline block mt-0.5">+1 (555) CareLoop</a>
                    </div>
                  </div>
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>

          {/* Device Navigation Bar */}
          <div className="h-16 px-6 border-t border-slate-900 bg-slate-900/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
            <button
              onClick={() => setActiveTab("instructions")}
              className={`flex flex-col items-center gap-1 text-[9px] font-bold ${
                activeTab === "instructions" ? "text-teal-400" : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <ClipboardCheck className="h-4.5 w-4.5" />
              <span>Care Guide</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex flex-col items-center gap-1 text-[9px] font-bold relative ${
                activeTab === "chat" ? "text-teal-400" : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <MessageCircle className="h-4.5 w-4.5" />
              <span>AI Chat</span>
              <span className="absolute -top-1.5 -right-1 flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex flex-col items-center gap-1 text-[9px] font-bold ${
                activeTab === "appointments" ? "text-teal-400" : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <Calendar className="h-4.5 w-4.5" />
              <span>Reschedule</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
