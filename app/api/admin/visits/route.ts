
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { VisitStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const status = searchParams.get("status");

    const where: any = {};

    if (fromDate && toDate) {
      where.createdAt = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    } else if (fromDate) {
      where.createdAt = {
        gte: new Date(fromDate),
      };
    } else if (toDate) {
      where.createdAt = {
        lte: new Date(toDate),
      };
    }

    if (status && status !== "all") {
      where.status = status as VisitStatus;
    }

    const visits = await prisma.visit.findMany({
      where,
      include: {
        studentInfo: true, // Include student information
        assignedDoctor: true, // Include assigned doctor information
        nurseNote: true,
        doctorNote: true,
        labResult: true,
        pharmacyNote: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json(
      { message: "Failed to fetch visits" },
      { status: 500 }
    );
  }
}
