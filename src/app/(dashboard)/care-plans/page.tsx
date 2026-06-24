import { prisma } from "@/lib/db";
import CarePlansClient from "./CarePlansClient";

interface PageProps {
  searchParams: Promise<{ clinicId?: string }>;
}

export default async function CarePlansPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const clinicId = searchParams.clinicId || "dental-clinic-id";

  // Fetch Care Plans for this clinic
  const carePlans = await prisma.carePlan.findMany({
    where: {
      clinicId,
    },
    include: {
      _count: {
        select: {
          followUps: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <CarePlansClient clinicId={clinicId} initialCarePlans={carePlans} />;
}
