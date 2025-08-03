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

 const visitsWithStringDates = visits.map((visit) => ({
  ...visit,
  createdAt: visit.createdAt.toISOString(),
  studentInfo: visit.studentInfo
    ? {
        ...visit.studentInfo,
        profileImageUrl: visit.studentInfo.profileImageUrl ?? undefined,
        gender: visit.studentInfo.gender ?? undefined,
        age: visit.studentInfo.age ?? undefined,
        phone: visit.studentInfo.phone ?? undefined,
        email: visit.studentInfo.email ?? undefined,
        college: visit.studentInfo.college ?? undefined,
        department: visit.studentInfo.department ?? undefined,
      }
    : null,
}));


  return (
   <PharmacyDashboard visits={visitsWithStringDates} stocks={stocks} />
  );
}
