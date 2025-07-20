import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const visitId = params.id;
  const body = await req.json();
  const { result, notes } = body;

  try {
    await prisma.labResult.create({
      data: {
        visitId,
        result,
        notes,
      },
    });

    await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: "LAB_RESULTS_READY",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving lab result:", error);
    return NextResponse.json({ error: "Failed to submit lab result" }, { status: 500 });
  }
}
