"use server";

import { prisma } from "@/lib/prisma";

export async function completeVisit(visitId: string) {
  await prisma.visit.update({
    where: { id: visitId },
    data: { status: "COMPLETED" },
  });
}
