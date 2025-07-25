
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STOCK_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const totalStock = await prisma.stock.count();
  const lowStock = await prisma.stock.count({
    where: {
      quantity: {
        lte: prisma.stock.fields.reorderLevel, // This will compare quantity with reorderLevel
      },
    },
  });

  const expiredStock = await prisma.stock.count({
    where: {
      expiryDate: {
        lt: new Date(),
      },
    },
  });

  const recentActivities = await prisma.stockActivity.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { stock: true },
  });

  return NextResponse.json({
    totalStock,
    lowStock,
    expiredStock,
    recentActivities,
  });
}
