// app/api/clinic/reception/visits/[studentId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"; // Adjust import path as needed

export async function GET(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    // Optional: Check if user is authenticated as reception (or any authorized role)
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "RECEPTION") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { studentId } = await params;

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Fetch visits for the studentId, ordered by creation date (newest first)
    // Include related data
    const visits = await prisma.visit.findMany({
      where: {
        studentId: studentId, // Use the original studentId
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        assignedDoctor: {
          select: {
            name: true,
          }
        },
        // Include note existence checks or summaries if needed
        nurseNote: {
            select: {
                id: true, // Just to check existence
                notes: true, // Or a summary if notes are long
            }
        },
        doctorNote: {
            select: {
                id: true,
                diagnosis: true, // Show diagnosis
                // prescription: true, // Could be long, maybe just indicate existence
            }
        },
        labResult: {
            select: {
                id: true, // Just to check existence
                // results: true, // Could be large JSON, maybe just indicate existence or summary
            }
        },
        pharmacyNote: {
            select: {
                id: true, // Just to check existence
                // stock: { select: { medicineName: true } }, // List of medicines? Could get complex.
            }
        }
        // Add other related notes/objects if you want to display info from them
      }
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 });
  }
}