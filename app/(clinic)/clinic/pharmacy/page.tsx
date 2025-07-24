// app/(clinic)/clinic/pharmacy/page.tsx

import { prisma } from "@/lib/prisma";
import PharmacyDashboard from "@/components/pharmacy/PharmacyDashboard";

export default async function PharmacyPage() {
  const [visits, stocks] = await Promise.all([
    prisma.visit.findMany({
      where: { status: "READY_FOR_PHARMACY" },
      include: {
        studentInfo: true,
        doctorNote: true,
      },
    }),
    prisma.stock.findMany(),
  ]);

  return (
   <PharmacyDashboard visits={visits} stocks={stocks} />
  );
}
