import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ visitId: string }> }) {
  const body = await request.json();
  const { bloodPressure, temperature, pulse, weight, notes } = body;

  const updated = await prisma.visit.update({
    where: { id: (await params).visitId },
    data: {
      status: "READY_FOR_DOCTOR",
      nurseNote: {
        create: {
          bloodPressure,
          temperature,
          pulse,
          weight,
          notes,
        },
      },
    },
  });

  return NextResponse.json(updated);
}
