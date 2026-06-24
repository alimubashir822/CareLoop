"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClinic } from "./clinic-context";
import {
  LayoutDashboard,
  Users,
  Workflow,
  MessageSquare,
  BarChart3,
  Settings,
  Activity,
  Heart,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { currentClinic, isMobileMenuOpen, setIsMobileMenuOpen } = useClinic();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      name: "Care Journeys",
      href: "/care-plans",
      icon: Activity,
    },
    {
      name: "Chronic Care",
      href: "/chronic-care",
      icon: Heart,
      badge: 2,
    },
    {
      name: "Workflow Builder",
      href: "/automations",
      icon: Workflow,
    },
    {
      name: "Message Inbox",
      href: "/messages",
      icon: MessageSquare,
      badge: 1, // Alert badge
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Helper to preserve clinicId in queries
  const getHref = (basePath: string) => {
    return `${basePath}?clinicId=${currentClinic.id}`;
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-20",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-white shadow-md shadow-teal-500/20 dark:shadow-teal-400/10">
          <Activity className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <span className="font-bold tracking-tight text-slate-900 dark:text-white text-lg">
            CareLoop <span className="text-teal-500">AI</span>
          </span>
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Clinician Suite
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navItems.map((item) => {
          // Check if active (excluding query params)
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={getHref(item.href)}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-teal-500 text-white shadow-md shadow-teal-500/10 dark:shadow-teal-400/5"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                <span>{item.name}</span>
              </div>
              {item.badge && !isActive && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-bounce">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Patient Portal Preview Link */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          href={`/portal/sarah-jenkins?clinicId=${currentClinic.id}`}
          target="_blank"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-700 bg-slate-100 rounded-lg hover:bg-teal-500 hover:text-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-teal-500 dark:hover:text-white transition-all shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Patient Portal Simulator
        </Link>
      </div>

      {/* Clinician Profile Footer */}
      <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white font-bold shadow-inner">
          SC
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950"></span>
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">
            Sarah Connor, RN
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            Care Coordinator
          </p>
        </div>
      </div>
      </aside>
    </>
  );
}
