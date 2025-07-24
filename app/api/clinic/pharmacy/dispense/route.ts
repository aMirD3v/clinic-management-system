// app/api/clinic/pharmacy/dispense/route.ts
// This API route handles dispensing medicines for a visit

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { visitId, medicines } = await request.json();

    // Update visit status to COMPLETED
    await prisma.visit.update({
      where: { id: visitId },
      data: { status: 'COMPLETED' },
    });

    for (const med of medicines) {
      const stock = await prisma.stock.findUnique({
        where: { medicineName: med.name },
      });

      if (!stock) {
        throw new Error(`Medicine "${med.name}" not found in stock.`);
      }

      if (stock.quantity < med.quantity) {
        throw new Error(`Not enough stock for "${med.name}". Requested: ${med.quantity}, Available: ${stock.quantity}`);
      }

      await prisma.stock.update({
        where: { medicineName: med.name },
        data: { quantity: stock.quantity - med.quantity }, // safer than decrement
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispense medicines' },
      { status: 500 }
    );
  }
}
