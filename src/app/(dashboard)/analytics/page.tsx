import { prisma } from "@/lib/db";
import AnalyticsClient from "./AnalyticsClient";

interface PageProps {
  searchParams: Promise<{ clinicId?: string }>;
}

export default async function AnalyticsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "dental-clinic-id";

  // Fetch all analytics database entries for this clinic
  const analytics = await prisma.analytics.findMany({
    where: {
      clinicId,
    },
    orderBy: {
      date: "asc",
    },
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Initialize a sorted record of the last 6 months to ensure we have standard charts
  const groupedData: Record<string, {
    month: string;
    responseRate: number;
    symptomAlerts: number;
    appointmentsRecovered: number;
    activePatients: number;
  }> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
    
    // Set defaults (which match seeded average benchmarks)
    groupedData[key] = {
      month: key,
      responseRate: 80,
      symptomAlerts: 5,
      appointmentsRecovered: 20,
      activePatients: 300,
    };
  }

  // Populate from database
  for (const entry of analytics) {
    const date = new Date(entry.date);
    const key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
    
    if (groupedData[key]) {
      if (entry.metric === "ResponseRate") {
        groupedData[key].responseRate = Math.round(entry.value);
      } else if (entry.metric === "SymptomAlerts") {
        groupedData[key].symptomAlerts = Math.round(entry.value);
      } else if (entry.metric === "AppointmentsRecovered") {
        groupedData[key].appointmentsRecovered = Math.round(entry.value);
      } else if (entry.metric === "ActivePatients") {
        groupedData[key].activePatients = Math.round(entry.value);
      }
    }
  }

  // Convert to ordered array
  const dataList = Object.values(groupedData);

  return <AnalyticsClient clinicId={clinicId} data={dataList} />;
}
