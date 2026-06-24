import { prisma } from "@/lib/db";
import PatientsClient from "./PatientsClient";

interface PageProps {
  searchParams: Promise<{ clinicId?: string; patientId?: string }>;
}

export default async function PatientsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "dental-clinic-id";
  const selectedPatientIdFromQuery = searchParams.patientId;

  // 1. Fetch Patients with visit details, follow-ups (including messages & responses), and tasks
  const patients = await prisma.patient.findMany({
    where: {
      clinicId,
    },
    include: {
      visits: {
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      },
      followUps: {
        include: {
          messages: {
            orderBy: {
              sentAt: "asc",
            },
          },
          responses: {
            orderBy: {
              respondedAt: "desc",
            },
          },
        },
        orderBy: {
          scheduledDate: "desc",
        },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // 2. Fetch CarePlan templates for assignment dropdown
  const carePlans = await prisma.carePlan.findMany({
    where: {
      clinicId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return (
    <PatientsClient
      clinicId={clinicId}
      patients={patients}
      carePlans={carePlans}
      selectedPatientIdFromQuery={selectedPatientIdFromQuery}
    />
  );
}
