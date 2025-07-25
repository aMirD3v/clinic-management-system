// app/api/clinic/reception/visits/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCachedStudent } from "@/lib/student/cacheStudent";

export async function POST(req: Request) {
  const { studentId, reason } = await req.json();
  // Remove this line:
  // const encodedId = encodeURIComponent(studentId); 

  // Pass the original studentId
  const studentInfo = await getOrCreateCachedStudent(studentId); 
  const visit = await prisma.visit.create({
    data: {
      studentId, // This is the original ID, likely used for reference/external API calls
      studentInfoId: studentInfo.id,
      reason,
    },
  });

  return NextResponse.json(visit);
}