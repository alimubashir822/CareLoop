"use client";

import { useState } from "react";
import {
  Workflow,
  Plus,
  Play,
  Clock,
  MessageSquare,
  ShieldAlert,
  Save,
  Trash2,
  Settings,
  ChevronRight,
  Info,
  Calendar,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
  id: string;
  type: "Trigger" | "Action" | "Delay" | "Condition" | "Escalation";
  title: string;
  details: string;
  config: {
    days?: number;
    channel?: string;
    message?: string;
    conditionField?: string;
    threshold?: number;
    recipient?: string;
  };
}

const templates = {
  dental: [
    { id: "1", type: "Trigger", title: "Visit Completed", details: "Triggered on Dental Implant procedure checkout", config: {} },
    { id: "2", type: "Action", title: "Send Care Instructions", details: "Immediate post-op guidelines via Portal link", config: { channel: "Portal", message: "Avoid hard or hot foods for 3 days. Gently rinse with warm salt water after 24 hours." } },
    { id: "3", type: "Delay", title: "Wait 1 Day", details: "Pause journey progression for 24 hours", config: { days: 1 } },
    { id: "4", type: "Action", title: "Send Day 1 Check-In", details: "Interactive SMS Swelling Triage Check", config: { channel: "SMS", message: "Hi, how is your swelling today? Reply: 1 (Good), 2 (Moderate), 3 (Severe)." } },
    { id: "5", type: "Delay", title: "Wait 2 Days", details: "Pause journey progression for 48 hours", config: { days: 2 } },
    { id: "6", type: "Condition", title: "AI Sentiment Analysis", details: "NLP checks patient response for emergency symptoms", config: { conditionField: "Pain/Bleeding level", threshold: 0.7 } },
    { id: "7", type: "Escalation", title: "Create Clinic Task & Alert Staff", details: "Creates High-Priority task assigned to clinic nurse", config: { recipient: "Nurse", message: "High risk symptoms flagged." } }
  ] as Node[],
  orthopedic: [
    { id: "1", type: "Trigger", title: "Surgery Completed", details: "Triggered on Knee/Joint surgery checkout", config: {} },
    { id: "2", type: "Action", title: "Send Pain Management Guide", details: "Immediate medication intake guide via Portal", config: { channel: "Portal", message: "Keep surgical dressing dry. Elevate leg and apply ice 20 mins hourly." } },
    { id: "3", type: "Delay", title: "Wait 2 Days", details: "Pause journey progression for 48 hours", config: { days: 2 } },
    { id: "4", type: "Action", title: "Send Day 2 Pain Survey", details: "Pain level questionnaire via Portal", config: { channel: "Portal", message: "How is your pain from 1 to 10? Are you able to take meds?" } },
    { id: "5", type: "Condition", title: "AI Pain Threshold Triage", details: "Flag pain levels exceeding 6/10", config: { conditionField: "Pain Score > 6", threshold: 0.6 } },
    { id: "6", type: "Escalation", title: "Alert Orthopedic Specialist", details: "Notify doctor and schedule phone follow-up", config: { recipient: "Doctor", message: "Patient reporting severe pain." } }
  ] as Node[],
  diabetes: [
    { id: "1", type: "Trigger", title: "Diabetes Care Enrollment", details: "Triggered when patient is enrolled in Chronic Care", config: {} },
    { id: "2", type: "Delay", title: "Wait 30 Days", details: "Pause for monthly cycle", config: { days: 30 } },
    { id: "3", type: "Action", title: "Send Glucose Level Check-in", details: "Outreach blood sugar log form", config: { channel: "Email", message: "Hi! It's time to log your weekly blood sugar readings in the CareLoop portal." } },
    { id: "4", type: "Delay", title: "Wait 90 Days", details: "Pause for quarterly cycle", config: { days: 90 } },
    { id: "5", type: "Action", title: "A1C Appointment Reminder", details: "SMS scheduling outreach", config: { channel: "SMS", message: "Your quarterly A1C check-up is due. Click here to schedule." } }
  ] as Node[]
};

export default function AutomationsBuilder() {
  const [activeTemplate, setActiveTemplate] = useState<"dental" | "orthopedic" | "diabetes">("dental");
  const [nodes, setNodes] = useState<Node[]>(templates[activeTemplate]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("2");
  const [saveStatus, setSaveStatus] = useState("");

  const handleTemplateChange = (tmpl: "dental" | "orthopedic" | "diabetes") => {
    setActiveTemplate(tmpl);
    setNodes(templates[tmpl]);
    setSelectedNodeId("2");
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const updateNodeConfig = (updatedConfig: any) => {
    if (!selectedNodeId) return;
    setNodes(prev =>
      prev.map(node =>
        node.id === selectedNodeId
          ? { ...node, config: { ...node.config, ...updatedConfig } }
          : node
      )
    );
  };

  const addNode = (type: Node["type"]) => {
    const newId = (Math.max(...nodes.map(n => parseInt(n.id) || 0)) + 1).toString();
    let newNode: Node;

    switch (type) {
      case "Action":
        newNode = {
          id: newId,
          type: "Action",
          title: "New Automated Message",
          details: "Send outreach via communications channel",
          config: { channel: "SMS", message: "Hi [Patient Name], how are you recovering today?" }
        };
        break;
      case "Delay":
        newNode = {
          id: newId,
          type: "Delay",
          title: "Wait Delay Timer",
          details: "Delay next outreach message",
          config: { days: 3 }
        };
        break;
      case "Condition":
        newNode = {
          id: newId,
          type: "Condition",
          title: "AI Response Assessment",
          details: "Evaluate patient reply text",
          config: { conditionField: "Response text sentiment", threshold: 0.5 }
        };
        break;
      case "Escalation":
        newNode = {
          id: newId,
          type: "Escalation",
          title: "Raise Clinic Risk Alert",
          details: "Create clinical follow-up task",
          config: { recipient: "Nurse", message: "Action required on response." }
        };
        break;
      default:
        return;
    }

    setNodes([...nodes, newNode]);
    setSelectedNodeId(newId);
  };

  const deleteNode = (id: string) => {
    if (nodes.length <= 1) return; // Must have at least 1 node
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(nodes[0].id);
  };

  const handleSave = () => {
    setSaveStatus("Saving workflow...");
    setTimeout(() => {
      setSaveStatus("Success! Care Journey synced to EHR systems.");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Care Journey Builder
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Design AI-driven communication sequences, waiting rules, check-in thresholds, and clinical task escalations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <select
            value={activeTemplate}
            onChange={(e) => handleTemplateChange(e.target.value as any)}
            className="flex-1 sm:flex-initial text-xs rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="dental">Template: Dental Implant Journey</option>
            <option value="orthopedic">Template: Orthopedic Post-Op</option>
            <option value="diabetes">Template: Chronic Diabetes Care</option>
          </select>
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-600 shadow-sm whitespace-nowrap"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 text-xs font-semibold">
          {saveStatus}
        </div>
      )}

      {/* Editor Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* Canvas Area (Visual Graph nodes) */}
        <div className="lg:col-span-2 xl:col-span-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl p-4 sm:p-8 min-h-[600px] flex flex-col justify-between shadow-inner relative overflow-hidden">
          {/* Canvas Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>

          {/* Node timeline container */}
          <div className="relative z-10 flex flex-col items-center gap-8 py-4">
            <AnimatePresence>
              {nodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;

                let borderGlow = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900";
                if (isSelected) borderGlow = "ring-2 ring-teal-500 bg-teal-500/5 dark:bg-teal-500/10 border-teal-500";

                let headerColor = "text-slate-400";
                if (node.type === "Trigger") headerColor = "text-emerald-500";
                else if (node.type === "Action") headerColor = "text-teal-500";
                else if (node.type === "Delay") headerColor = "text-amber-500";
                else if (node.type === "Condition") headerColor = "text-purple-500";
                else if (node.type === "Escalation") headerColor = "text-rose-500";

                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {/* SVG Connector Line */}
                    {index > 0 && (
                      <div className="h-8 flex flex-col items-center justify-center pointer-events-none">
                        <svg className="w-1 h-8 text-slate-300 dark:text-slate-800" fill="none" viewBox="0 0 4 32">
                          <line x1="2" y1="0" x2="2" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                        </svg>
                      </div>
                    )}

                    {/* Node Card */}
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className={`w-80 rounded-xl border p-4 shadow-sm relative group cursor-pointer hover:shadow-md transition-all ${borderGlow}`}
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      {/* Node delete */}
                      {node.type !== "Trigger" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNode(node.id);
                          }}
                          className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 hover:text-rose-500 text-slate-400 dark:text-slate-600 transition-all p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <div className="flex gap-3">
                        <div className={`mt-0.5 ${headerColor}`}>
                          {node.type === "Trigger" && <Play className="h-4.5 w-4.5 fill-current" />}
                          {node.type === "Action" && <MessageSquare className="h-4.5 w-4.5" />}
                          {node.type === "Delay" && <Clock className="h-4.5 w-4.5" />}
                          {node.type === "Condition" && <Sparkles className="h-4.5 w-4.5" />}
                          {node.type === "Escalation" && <ShieldAlert className="h-4.5 w-4.5" />}
                        </div>
                        <div>
                          <div className={`text-[9px] font-bold uppercase tracking-wider ${headerColor}`}>
                            {node.type} Node
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            {node.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {node.details}
                          </p>

                          {/* Extra info inline preview */}
                          {node.config.days && (
                            <span className="inline-block mt-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded px-1.5 py-0.5 text-[9px] font-bold">
                              Delay: {node.config.days} Day{node.config.days > 1 && "s"}
                            </span>
                          )}
                          {node.config.channel && (
                            <span className="inline-block mt-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded px-1.5 py-0.5 text-[9px] font-bold">
                              Send on: {node.config.channel}
                            </span>
                          )}
                          {node.config.recipient && (
                            <span className="inline-block mt-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded px-1.5 py-0.5 text-[9px] font-bold">
                              Target: {node.config.recipient} Staff
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Node Add Bar */}
          <div className="relative z-10 border-t border-slate-200 dark:border-slate-800 pt-6 mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Add elements to care flow sequence:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addNode("Delay")}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                + Wait Timer
              </button>
              <button
                onClick={() => addNode("Action")}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5 text-teal-500" />
                + Message/Portal
              </button>
              <button
                onClick={() => addNode("Condition")}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                + AI Assessment
              </button>
              <button
                onClick={() => addNode("Escalation")}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                + Staff Escalation
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Inspector (Node Config Panel) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Settings className="h-4.5 w-4.5 text-teal-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Step Inspector
            </h3>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                  Node Type
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  {selectedNode.type} Step
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                  Step Display Title
                </label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    setNodes(prev =>
                      prev.map(node =>
                        node.id === selectedNodeId ? { ...node, title: e.target.value } : node
                      )
                    );
                  }}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                  Description / Subtext
                </label>
                <textarea
                  value={selectedNode.details}
                  onChange={(e) => {
                    setNodes(prev =>
                      prev.map(node =>
                        node.id === selectedNodeId ? { ...node, details: e.target.value } : node
                      )
                    );
                  }}
                  rows={2}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500 resize-none"
                />
              </div>

              {/* Dynamic node settings fields based on node type */}
              {selectedNode.type === "Delay" && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                    Wait Delay Timer (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={selectedNode.config.days || 1}
                    onChange={(e) => updateNodeConfig({ days: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500"
                  />
                </div>
              )}

              {selectedNode.type === "Action" && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                      Communications Channel
                    </label>
                    <select
                      value={selectedNode.config.channel || "SMS"}
                      onChange={(e) => updateNodeConfig({ channel: e.target.value })}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500"
                    >
                      <option value="SMS">Outreach: SMS text message</option>
                      <option value="Portal">Outreach: Mobile Portal check-in</option>
                      <option value="Email">Outreach: Email newsletter/reminder</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                      Outbound Message Template
                    </label>
                    <textarea
                      value={selectedNode.config.message || ""}
                      onChange={(e) => updateNodeConfig({ message: e.target.value })}
                      rows={5}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500 resize-none leading-relaxed"
                      placeholder="Enter SMS/Portal text template..."
                    />
                    <span className="text-[9px] text-slate-400 leading-normal block mt-1.5">
                      Tip: Use custom messages to instruct patients on wound checks, medications, or scheduling options.
                    </span>
                  </div>
                </>
              )}

              {selectedNode.type === "Condition" && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                      NLP Triage Assessment Variable
                    </label>
                    <input
                      type="text"
                      value={selectedNode.config.conditionField || ""}
                      onChange={(e) => updateNodeConfig({ conditionField: e.target.value })}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                      Risk Sensitivity Threshold ({Math.round((selectedNode.config.threshold || 0.5) * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.1"
                      value={selectedNode.config.threshold || 0.5}
                      onChange={(e) => updateNodeConfig({ threshold: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-teal-500 mt-2"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                      <span>Low Risk (Sensitive)</span>
                      <span>High Risk (Emergency only)</span>
                    </div>
                  </div>
                </>
              )}

              {selectedNode.type === "Escalation" && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                      Escalation Recipient Role
                    </label>
                    <select
                      value={selectedNode.config.recipient || "Nurse"}
                      onChange={(e) => updateNodeConfig({ recipient: e.target.value })}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500"
                    >
                      <option value="Nurse">Care Coordinator / Nurse Desk</option>
                      <option value="Doctor">Attending Physician / Specialist</option>
                      <option value="Admin">Clinic Office Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                      Staff Task Template
                    </label>
                    <input
                      type="text"
                      value={selectedNode.config.message || ""}
                      onChange={(e) => updateNodeConfig({ message: e.target.value })}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">
              Select a node in the canvas to view or modify details.
            </p>
          )}

          {/* Tips Info Panel */}
          <div className="rounded-lg bg-teal-500/5 border border-teal-500/10 p-4 text-[10px] text-slate-600 dark:text-slate-400 space-y-2">
            <span className="font-bold flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <Info className="h-3.5 w-3.5 shrink-0" />
              EHR Trigger Integration
            </span>
            <p className="leading-relaxed">
              When a doctor registers a patient's checkout in the EHR (e.g. AthenaHealth or Epic), CareLoop AI intercepts the visit code and auto-starts the selected sequence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
