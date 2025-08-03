import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await request.json();

    const {
      medicineName,
      description,
      batchNumber,
      manufacturer,
      quantity,
      unit,
      price,
      costPrice,
      expiryDate,
      manufactureDate,
      reorderLevel,
      maxStockLevel,
      storageLocation,
      notes,
    } = body;

    if (!medicineName || !quantity || !unit || !expiryDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const stock = await prisma.stock.update({
      where: { id },
      data: {
        medicineName,
        description,
        batchNumber,
        manufacturer,
        quantity,
        unit,
        price,
        costPrice,
        expiryDate: new Date(expiryDate),
        manufactureDate: manufactureDate ? new Date(manufactureDate) : null,
        reorderLevel,
        maxStockLevel,
        storageLocation,
        notes,
      },
    });

    return NextResponse.json(stock);
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { message: "Failed to update stock" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.stock.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    return NextResponse.json(
      { message: "Failed to delete stock" },
      { status: 500 }
    );
  }
}
