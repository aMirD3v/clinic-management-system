
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const visit = await prisma.visit.update({
      where: { id },
      data: {
        status,
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error("Error updating visit:", error);
    return NextResponse.json(
      { message: "Failed to update visit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.visit.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Visit deleted successfully" });
  } catch (error) {
    console.error("Error deleting visit:", error);
    return NextResponse.json(
      { message: "Failed to delete visit" },
      { status: 500 }
    );
  }
}
