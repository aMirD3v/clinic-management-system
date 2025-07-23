// app/api/clinic/laboratory/visits/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const visits = await prisma.visit.findMany({
      where: { status: "SENT_TO_LAB" },
      orderBy: { createdAt: "desc" },
      include: {
        studentInfo: true,
         doctorNote: true,
      },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching lab visits:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
