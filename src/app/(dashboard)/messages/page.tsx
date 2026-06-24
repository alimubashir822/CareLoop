import { prisma } from "@/lib/db";
import MessagesClient from "./MessagesClient";

interface PageProps {
  searchParams: Promise<{ clinicId?: string; patientId?: string }>;
}

export default async function MessagesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "dental-clinic-id";
  const selectedPatientIdFromQuery = searchParams.patientId;

  // Fetch all patients for this clinic along with their complete message logs
  const patients = await prisma.patient.findMany({
    where: {
      clinicId,
    },
    include: {
      messages: {
        orderBy: {
          sentAt: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Map database structures to chat component interfaces
  const formattedPatients = patients.map((p) => ({
    id: p.id,
    name: p.name,
    phone: p.phone,
    status: p.status,
    messages: p.messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      content: m.content,
      sentAt: m.sentAt,
      status: m.status,
    })),
  }));

  return (
    <MessagesClient
      clinicId={clinicId}
      patients={formattedPatients}
      selectedPatientIdFromQuery={selectedPatientIdFromQuery}
    />
  );
}
