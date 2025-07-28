
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const allowedRoles = ["STOCK_MANAGER", "ADMIN"];
  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const allowedRoles = ["STOCK_MANAGER", "ADMIN"];
  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();
  const newNotification = await prisma.notification.create({ data });
  return NextResponse.json(newNotification, { status: 201 });
}
