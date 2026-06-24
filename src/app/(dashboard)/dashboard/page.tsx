import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";

interface PageProps {
  searchParams: Promise<{ clinicId?: string }>;
}

export default async function DashboardPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "dental-clinic-id";

  // 1. Fetch statistics
  const pendingCount = await prisma.followUp.count({
    where: {
      status: "Pending",
      patient: { clinicId },
    },
  });

  const completedCount = await prisma.followUp.count({
    where: {
      status: "Completed",
      patient: { clinicId },
    },
  });

  const alertsCount = await prisma.task.count({
    where: {
      clinicId,
      status: "Pending",
      priority: { in: ["Urgent", "High"] },
    },
  });

  // Calculate engagement rate
  const totalOutreach = completedCount + pendingCount;
  const engagementRate = totalOutreach > 0 ? Math.round((completedCount / totalOutreach) * 100) : 84;

  // 2. Fetch Pending Tasks (with patient risk scores)
  const rawTasks = await prisma.task.findMany({
    where: {
      clinicId,
      status: "Pending",
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          status: true,
          predictiveRiskScore: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Sort tasks by priority (Urgent -> High -> Medium -> Low)
  const priorityMap: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
  const sortedTasks = [...rawTasks].sort((a, b) => {
    const weightA = priorityMap[a.priority] ?? 99;
    const weightB = priorityMap[b.priority] ?? 99;
    return weightA - weightB;
  });

  // 3. Fetch Patient Responses with "Alert" sentiments
  const alerts = await prisma.patientResponse.findMany({
    where: {
      patient: { clinicId },
      sentiment: "Alert",
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
    orderBy: {
      respondedAt: "desc",
    },
  });

  // 4. Fetch recent scheduled follow-ups
  const recentFollowUps = await prisma.followUp.findMany({
    where: {
      patient: { clinicId },
    },
    include: {
      patient: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      scheduledDate: "desc",
    },
    take: 6,
  });

  return (
    <DashboardClient
      clinicId={clinicId}
      stats={{
        pending: pendingCount,
        completed: completedCount,
        alerts: alertsCount,
        rate: engagementRate,
      }}
      tasks={sortedTasks}
      alerts={alerts}
      recentFollowUps={recentFollowUps}
    />
  );
}
