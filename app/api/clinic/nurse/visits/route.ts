import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const visits = await prisma.visit.findMany({
    where: { status: "WAITING_FOR_NURSE" },
    include: {
      nurseNote: true,
      studentInfo: true,
      assignedDoctor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(visits);
}
