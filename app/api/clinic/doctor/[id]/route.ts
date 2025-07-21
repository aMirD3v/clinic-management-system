import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const visitId = (await params).id

  try {
    const body = await req.json()
    const { diagnosis, prescription, requestLabTest, notes } = body

const updatedVisit = await prisma.visit.update({
  where: { id: visitId },
  data: {
    doctorNote: {
      upsert: {
        create: { diagnosis, prescription, notes, requestLabTest },
        update: { diagnosis, prescription, notes, requestLabTest },
      },
    },
    status: requestLabTest ? 'SENT_TO_LAB' : 'READY_FOR_PHARMACY',
  },
});


    return NextResponse.json(updatedVisit)
  } catch (error) {
    console.error('❌ Doctor Visit Update Error:', error)
    return NextResponse.json({ error: 'Failed to update visit' }, { status: 500 })
  }
}
