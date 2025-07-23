// app/api/clinic/doctor/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const visitId = params.id;

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