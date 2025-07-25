// lib/student/cacheStudent.ts
import { prisma } from "@/lib/prisma";

export async function getOrCreateCachedStudent(studentId: string) {
  // First check if we already cached it using the original ID
  const cached = await prisma.studentInfo.findUnique({ where: { studentId } }); // <-- studentId is the original
  if (cached) return cached;

  // If not, fetch from external API - encode the ID HERE for the URL
  const encodedIdForUrl = encodeURIComponent(studentId); // Encode only for the URL
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${encodedIdForUrl}`); // Use encoded ID in URL
  if (!res.ok) throw new Error("Student not found");
  const student = await res.json();

  // Save to DB using the original studentId to maintain consistency
  return await prisma.studentInfo.create({
    data: {
      studentId: student.studentId, // This should ideally be the same as the input studentId
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