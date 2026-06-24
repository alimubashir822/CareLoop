import { prisma } from "@/lib/db";
import PortalClient from "./PortalClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ patientId: string }>;
}

export default async function PatientPortalPage(props: PageProps) {
  const params = await props.params;
  const patientId = params.patientId;

  let patient = null;

  // Support both dynamic slugs (e.g. "sarah-jenkins") and standard UUID database IDs
  if (patientId === "sarah-jenkins") {
    patient = await prisma.patient.findFirst({
      where: {
        name: "Sarah Jenkins",
      },
      include: {
        visits: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
        messages: {
          orderBy: {
            sentAt: "asc",
          },
        },
        appointments: {
          orderBy: {
            scheduledAt: "desc",
          },
          take: 5,
        },
      },
    });
  } else {
    patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        visits: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
        messages: {
          orderBy: {
            sentAt: "asc",
          },
        },
        appointments: {
          orderBy: {
            scheduledAt: "desc",
          },
          take: 5,
        },
      },
    });
  }

  if (!patient) {
    return notFound();
  }

  // Map database patient models to Portal Client interface
  const formattedPatient = {
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    status: patient.status,
    visits: patient.visits.map((v) => ({
      id: v.id,
      treatment: v.treatment,
      instructions: v.instructions,
    })),
    messages: patient.messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      content: m.content,
      sentAt: m.sentAt,
    })),
    appointments: patient.appointments.map((a) => ({
      id: a.id,
      scheduledAt: a.scheduledAt,
      status: a.status,
      type: a.type,
    })),
  };

  return <PortalClient patient={formattedPatient} />;
}
