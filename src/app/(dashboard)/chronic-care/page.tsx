import { prisma } from "@/lib/db";
import ChronicCareClient from "./ChronicCareClient";

interface PageProps {
  searchParams: Promise<{ clinicId?: string }>;
}

export default async function ChronicCarePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "primary-clinic-id";

  const programs = await prisma.chronicProgram.findMany({
    where: { clinicId },
    include: {
      enrollments: {
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              status: true,
              predictiveRiskScore: true,
              healthEngagementScore: true,
              communicationPreference: true,
            },
          },
          vitalReadings: {
            orderBy: { recordedAt: "desc" },
            take: 5,
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Also fetch all patients for enrollment modal
  const allPatients = await prisma.patient.findMany({
    where: { clinicId },
    select: { id: true, name: true, status: true },
    orderBy: { name: "asc" },
  });

  return (
    <ChronicCareClient
      clinicId={clinicId}
      initialPrograms={programs}
      allPatients={allPatients}
    />
  );
}
