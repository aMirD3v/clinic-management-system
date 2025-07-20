import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { studentId, reason } = await req.json();

  const visit = await prisma.visit.create({
    data: {
      studentId,
      reason,
    },
  });

  return NextResponse.json(visit);
}
