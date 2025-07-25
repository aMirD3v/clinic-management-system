
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringStock = await prisma.stock.findMany({
    where: {
      expiryDate: {
        lte: thirtyDaysFromNow,
      },
    },
  });

  for (const item of expiringStock) {
    const message = `${item.medicineName} is expiring on ${item.expiryDate.toLocaleDateString()}`;
    await prisma.notification.create({
      data: {
        message,
        type: "EXPIRY_WARNING",
      },
    });
  }

  const lowStockItems = await prisma.stock.findMany({
    where: {
      reorderLevel: {
        not: null,
      },
      quantity: {
        lte: prisma.stock.fields.reorderLevel,
      },
    },
  });

  for (const item of lowStockItems) {
    const message = `${item.medicineName} is low in stock. Current quantity: ${item.quantity}, Reorder level: ${item.reorderLevel}`;
    await prisma.notification.create({
      data: {
        message,
        type: "LOW_STOCK_WARNING",
      },
    });
  }

  return NextResponse.json({ message: "Expiry and low stock check complete" });
}
