import { prisma } from "@/lib/db";
import { Settings, ShieldCheck, ClipboardList, Clock, Palette, Sparkles } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ clinicId?: string }>;
}

export default async function SettingsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "dental-clinic-id";

  // Fetch all audit logs
  const auditLogs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 15,
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings & Compliance
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage clinic settings, clinician user permissions, and review security audit logs.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {/* Left Column: Clinic info & White-label SaaS details */}
        <div className="md:col-span-1 space-y-6">
          
          {/* White-Label SaaS Branding Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
              <Palette className="h-4.5 w-4.5 text-teal-500" />
              White-Label SaaS Branding
            </h3>
            
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              CareLoop AI is built as a multi-tenant hospital/clinic platform. Changing clinics in the header dropdown instantly re-binds the primary CSS theme values:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#0d9488]"></span>
                <span className="font-semibold">CareLoop Dental</span>
                <span className="text-[10px] text-slate-400 font-medium ml-auto">Teal Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#6366f1]"></span>
                <span className="font-semibold">Summit Surgical</span>
                <span className="text-[10px] text-slate-400 font-medium ml-auto">Indigo Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#0284c7]"></span>
                <span className="font-semibold">HealthFlow Primary</span>
                <span className="text-[10px] text-slate-400 font-medium ml-auto">Sky Accent</span>
              </div>
            </div>
            
            <div className="rounded bg-slate-50 dark:bg-slate-950 p-2.5 text-[9px] text-slate-500 leading-normal flex items-start gap-1">
              <Sparkles className="h-3.5 w-3.5 text-teal-500 shrink-0 mt-0.5" />
              <span>Theme accents apply to active buttons, side links, gauges, and notifications.</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
              <ShieldCheck className="h-4.5 w-4.5 text-teal-500" />
              Role Permissions
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-350">Doctor</span>
                <span className="text-[10px] text-slate-400">Diagnosis & Care Guidelines</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-350">Nurse</span>
                <span className="text-[10px] text-slate-400">Triage & Reschedules</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-350">Coordinator</span>
                <span className="text-[10px] text-slate-400">Campaign Builder & Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Log Card */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-855 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="h-4.5 w-4.5 text-teal-500" />
              Enterprise HIPAA Audit Logs
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Traceability records of clinician logins, task completions, manual override communications, and AI care plan generations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Action</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      No compliance logs found.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-3 font-semibold">
                        {log.user.name}
                        <span className="block text-[9px] text-slate-400 font-medium">
                          {log.user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          log.action === "MANUAL_MESSAGE"
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400"
                            : log.action === "COMPLETE_TASK"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : log.action === "GENERATE_PLAN"
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400"
                            : "bg-slate-100 text-slate-655 dark:bg-slate-800"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 max-w-[200px] truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-3 text-slate-400 text-[10px]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
