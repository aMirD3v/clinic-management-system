import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const visits = await prisma.visit.findMany({
    where: {
      status: { in: ['READY_FOR_DOCTOR', 'LAB_RESULTS_READY'] },
    },
    include: {
      nurseNote: true,
      labResult: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(visits)
}
