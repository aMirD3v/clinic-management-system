// app/api/clinic/doctor/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise <{ id: string }> }) {
  const { id: visitId } = await params;

  try {
    const body = await req.json();
    const { diagnosis, prescription, requestLabTest, labTests, notes } = body;

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        doctorNote: {
          upsert: {
            create: { 
              diagnosis, 
              prescription, 
              requestLabTest, 
              labTests,   // Add this
              notes 
            },
            update: { 
              diagnosis, 
              prescription, 
              requestLabTest, 
              labTests,   // Add this
              notes 
            },
          },
        },
        status: requestLabTest ? 'SENT_TO_LAB' : 'READY_FOR_PHARMACY',
      },
    });

    return NextResponse.json(updatedVisit);
  } catch (error) {
    console.error('❌ Doctor Visit Update Error:', error);
    return NextResponse.json({ error: 'Failed to update visit' }, { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    // Fetch the specific visit by ID, including ALL related information
    const visit = await prisma.visit.findUnique({
      where: { id: id },
      include: {
        studentInfo: true, // Get full student details
        nurseNote: true,   // Get nurse vitals
        doctorNote: true,  // Get previous doctor notes for this visit (if exists)
        labResult: true,   // Get lab results
        pharmacyNote: {
          include: {
            stock: { // Include medicine details
              select: {
                 medicineName: true,
                 description: true,
                 unit: true
              }
            }
          }
        },
        // assignedDoctor is usually the current doctor, but include if needed for display
        // assignedDoctor: true,
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    const previousVisits = await prisma.visit.findMany({
      where: {
        studentId: visit.studentId,
        NOT: { 
          id: id
        }
      },
      orderBy: {
        createdAt: 'desc', 
      },
      include: {
        doctorNote: {
          select: {
            diagnosis: true,
            prescription: true,
          }
        },
        nurseNote: {
          select: {
            bloodPressure: true,
            temperature: true,
            pulse: true,
            weight: true,
          }
        },
        labResult: {
          select: {
            id: true,
          }
        },
        pharmacyNote: {
            select: {
                id: true, 
                createdAt: true,
                stock: {
                    select: {
                        medicineName: true
                    }
                }
            }
        }
      },
      take: 5
    });

    return NextResponse.json({ visit, previousVisits });
  } catch (error) {
    console.error("Error fetching visit details:", error);
    return NextResponse.json({ error: "Failed to fetch visit details" }, { status: 500 });
  }
}

