import React, { Suspense } from "react";
import { ClinicProvider } from "@/components/clinic-context";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        {/* Sidebar Nav */}
        <Sidebar />

        {/* Content Panel */}
        <div className="lg:pl-64 pl-0 flex flex-col min-h-screen">
          <Suspense fallback={<div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-950/75 animate-pulse"></div>}>
            <Header />
          </Suspense>
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ClinicProvider>
  );
}
