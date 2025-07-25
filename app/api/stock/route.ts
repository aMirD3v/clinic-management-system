
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STOCK_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const stock = await prisma.stock.findMany();
  return NextResponse.json(stock);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STOCK_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();
  const newStock = await prisma.stock.create({ data });
  await prisma.stockActivity.create({
    data: {
      stockId: newStock.id,
      activity: "CREATED",
      details: { newData: newStock },
    },
  });
  return NextResponse.json(newStock, { status: 201 });
}
