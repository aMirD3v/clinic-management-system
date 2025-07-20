// POST: Save doctor note and update visit status
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { visitId, diagnosis, prescription, notes, requestLabTest } = data;

    const note = await prisma.doctorNote.create({
      data: {
        visitId,
        diagnosis,
        prescription,
        notes,
        requestLabTest,
      },
    });

    await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: requestLabTest ? "SENT_TO_LAB" : "READY_FOR_PHARMACY",
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("Doctor Note Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
