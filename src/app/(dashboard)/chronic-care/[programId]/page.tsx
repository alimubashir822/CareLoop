import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProgramDetailClient from "./ProgramDetailClient";

interface PageProps {
  params: Promise<{ programId: string }>;
  searchParams: Promise<{ clinicId?: string; enrollmentId?: string }>;
}

export default async function ProgramDetailPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "primary-clinic-id";
  const { programId } = params;

  const program = await prisma.chronicProgram.findUnique({
    where: { id: programId },
    include: {
      enrollments: {
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
              predictiveRiskScore: true,
              healthEngagementScore: true,
              communicationPreference: true,
              memoryNotes: true,
            },
          },
          vitalReadings: {
            orderBy: { recordedAt: "asc" },
          },
        },
      },
    },
  });

  if (!program) notFound();

  // Determine which enrollment to show (from query param or first one)
  const selectedEnrollmentId = searchParams.enrollmentId;
  const activeEnrollment =
    program.enrollments.find((e) => e.id === selectedEnrollmentId) ||
    program.enrollments[0];

  return (
    <ProgramDetailClient
      clinicId={clinicId}
      program={program}
      activeEnrollment={activeEnrollment ?? null}
    />
  );
}
