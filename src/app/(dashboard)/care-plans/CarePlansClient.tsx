"use client";

import { useState, useTransition } from "react";
import { Activity, Clock, MessageSquare, ArrowRight, Play, Sparkles, Plus, Check } from "lucide-react";
import { generateAICarePlan } from "@/lib/db-actions";
import Link from "next/link";

interface CarePlan {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  stepsJson: string;
  _count: {
    followUps: number;
  };
}

interface CarePlansClientProps {
  clinicId: string;
  initialCarePlans: CarePlan[];
}

export default function CarePlansClient({ clinicId, initialCarePlans }: CarePlansClientProps) {
  const [prompt, setPrompt] = useState("");
  const [plans, setPlans] = useState<CarePlan[]>(initialCarePlans);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    setPrompt("");

    startTransition(async () => {
      const res = await generateAICarePlan(clinicId, currentPrompt);
      if (res.success && res.plan) {
        setMsg(`AI generated plan: "${res.plan.name}" successfully!`);
        
        // Append locally
        const newPlan: CarePlan = {
          id: res.plan.id,
          name: res.plan.name,
          description: res.plan.description,
          triggerEvent: res.plan.triggerEvent,
          stepsJson: res.plan.stepsJson,
          _count: { followUps: 0 }
        };
        setPlans(prev => [newPlan, ...prev]);
        setTimeout(() => setMsg(""), 4000);
      } else {
        setMsg("Failed to generate plan.");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Care Journeys
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Standard templates representing post-visit follow-up protocols, timeline delays, and AI triage checks.
          </p>
        </div>
        <Link
          href={`/automations?clinicId=${clinicId}`}
          className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-600 shadow-sm self-start md:self-auto"
        >
          Open Workflow Builder
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* AI Care Plan Generator Form (CRM Feature) */}
      <div className="rounded-xl border border-teal-500/20 bg-gradient-to-tr from-teal-500/5 to-indigo-500/5 p-6 glass-panel">
        <div className="flex items-center gap-2.5 mb-3">
          <Sparkles className="h-5 w-5 text-teal-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-teal-400">
            AI Care Plan Generator
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          Type a clinical prompt (e.g. <em>"wisdom teeth extraction soft food guidelines"</em> or <em>"knee replacement physical therapy schedule"</em>) and let the AI generate a custom post-visit outreach timeline dynamically.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Describe the treatment and recovery timeline..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isPending}
            className="flex-1 text-xs rounded-lg border border-slate-200 bg-white px-4 py-2.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:border-teal-500 transition-all text-slate-700"
          />
          <button
            type="submit"
            disabled={isPending || !prompt.trim()}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-50 transition-colors shadow-sm w-full sm:w-auto shrink-0"
          >
            {isPending ? "Generating..." : "Generate AI Plan"}
          </button>
        </form>

        {msg && (
          <div className="mt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
            <Check className="h-4 w-4" />
            {msg}
          </div>
        )}
      </div>

      {/* Journeys Grid */}
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
        {plans.map((plan) => {
          const steps = JSON.parse(plan.stepsJson) as Array<{
            day: number;
            type: string;
            channel: string;
            title: string;
          }>;

          return (
            <div
              key={plan.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100">
                        {plan.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Trigger: {plan.triggerEvent}
                      </span>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active Journey
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {plan.description}
                </p>

                {/* Steps Visual Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    Journey Steps & Sequence
                  </h4>
                  <div className="space-y-2.5 border-l border-slate-200 dark:border-slate-800 pl-4 ml-1">
                    {steps.map((step, idx) => {
                      let Icon = MessageSquare;
                      let iconColor = "text-teal-500";
                      if (step.type === "Instructions") {
                        Icon = Play;
                        iconColor = "text-emerald-500";
                      } else if (step.type === "Delay") {
                        Icon = Clock;
                        iconColor = "text-amber-500";
                      } else if (step.type === "CheckIn") {
                        Icon = MessageSquare;
                        iconColor = "text-purple-500";
                      } else if (step.type === "Reminder") {
                        Icon = Clock;
                        iconColor = "text-indigo-500";
                      }

                      return (
                        <div key={idx} className="relative flex items-start gap-2 text-xs">
                          {/* Dot connector */}
                          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-white border-2 border-slate-250 dark:bg-slate-950 dark:border-slate-800"></span>
                          
                          <div className="flex gap-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-350 w-12 shrink-0">
                              Day {step.day}:
                            </span>
                            <div className="text-slate-600 dark:text-slate-400">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {step.title}
                              </span>{" "}
                              ({step.channel || "Portal"})
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Enrolled Patients: <strong>{plan._count.followUps}</strong>
                </span>
                <Link
                  href={`/automations?clinicId=${clinicId}`}
                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  Edit Sequence
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
