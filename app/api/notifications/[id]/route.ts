
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function PUT(req: NextRequest, { params }: { params: Promise <{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STOCK_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
  return NextResponse.json(updatedNotification);
}


//  add delete method to remove a notification
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STOCK_MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.notification.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Notification deleted successfully" });
}