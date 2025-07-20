import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCachedStudent } from "@/lib/student/cacheStudent";

export async function POST(req: Request) {
  const { studentId, reason } = await req.json();

  const studentInfo = await getOrCreateCachedStudent(studentId);
  const visit = await prisma.visit.create({
    data: {
      studentId,
      studentInfoId: studentInfo.id,
      reason,
    },
  });

  return NextResponse.json(visit);
}
