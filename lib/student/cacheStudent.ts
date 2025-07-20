// lib/student/cacheStudent.ts

import { prisma } from "@/lib/prisma";

export async function getOrCreateCachedStudent(studentId: string) {
  // First check if we already cached it
  const cached = await prisma.studentInfo.findUnique({ where: { studentId } });
  if (cached) return cached;

  // If not, fetch from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${studentId}`);
  if (!res.ok) throw new Error("Student not found");
  const student = await res.json();

  // Save to DB
  return await prisma.studentInfo.create({
    data: {
      studentId: student.studentId,
      fullName: student.fullName,
      gender: student.gender,
      age: student.age,
      email: student.email,
      phone: student.phone,
      college: student.college,
      department: student.department,
      profileImageUrl: student.profileImageUrl,
    },
  });
}
