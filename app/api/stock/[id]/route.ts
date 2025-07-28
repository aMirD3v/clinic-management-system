import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STOCK_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const oldData = await prisma.stock.findUnique({ where: { id } });
  const data = await req.json();
  const updatedStock = await prisma.stock.update({
    where: { id },
    data,
  });

  await prisma.stockActivity.create({
    data: {
      stockId: updatedStock.id,
      activity: "UPDATED",
      details: { oldData, newData: updatedStock },
    },
  });

  return NextResponse.json(updatedStock);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STOCK_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = params;

  // First delete all associated stock activities
  await prisma.stockActivity.deleteMany({ where: { stockId: id } });

  // Then delete the stock item
  const deletedStock = await prisma.stock.delete({ where: { id } });

  return NextResponse.json({ message: "Stock deleted" }, { status: 200 });
}
