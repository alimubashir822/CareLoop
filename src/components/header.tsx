"use client";

import { useClinic } from "./clinic-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bell, Moon, Sun, Search, Building2, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const { currentClinic, setCurrentClinic, clinics, isDarkMode, toggleTheme, setIsMobileMenuOpen } = useClinic();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectClinic = (clinicId: string) => {
    const selected = clinics.find((c) => c.id === clinicId);
    if (selected) {
      setCurrentClinic(selected);
      setDropdownOpen(false);

      // Create new search parameters containing the selected clinic
      const params = new URLSearchParams(searchParams.toString());
      params.set("clinicId", clinicId);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/75 px-4 md:px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/75 transition-colors duration-200">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Input */}
      <div className="relative w-72 max-w-xs md:flex hidden">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
        </span>
        <input
          type="text"
          placeholder="Search patients, medical records..."
          className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-1.5 pl-10 pr-4 text-xs outline-none focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-teal-500 dark:focus:bg-slate-950 transition-all text-slate-700"
        />
      </div>

      {/* Title / Action items */}
      <div className="flex items-center gap-6">
        {/* Clinic Switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all"
          >
            <Building2 className="h-3.5 w-3.5 text-teal-500" />
            <span>{currentClinic.name}</span>
            <ChevronDown className="h-3 w-3 text-slate-400 dark:text-slate-500" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-1.5 w-60 origin-top-right rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-40">
                <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  Select Clinic Office
                </div>
                {clinics.map((clinic) => (
                  <button
                    key={clinic.id}
                    onClick={() => selectClinic(clinic.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs text-left font-medium transition-colors",
                      currentClinic.id === clinic.id
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    )}
                  >
                    <span>{clinic.name}</span>
                    {currentClinic.id === clinic.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-all"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-all"
            aria-label="View notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
