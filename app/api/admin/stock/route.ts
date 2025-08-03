
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const expiringSoon = searchParams.get("expiringSoon");
    const outOfStock = searchParams.get("outOfStock");

    const where: any = {};

    if (expiringSoon === "true") {
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      where.expiryDate = {
        lte: threeMonthsFromNow,
      };
      where.quantity = {
        gt: 0,
      };
    } else if (outOfStock === "true") {
      where.quantity = 0;
    }

    const stock = await prisma.stock.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(stock);
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json(
      { message: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const stock = await prisma.stock.create({
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

    return NextResponse.json(stock, { status: 201 });
  } catch (error) {
    console.error("Error creating stock:", error);
    return NextResponse.json(
      { message: "Failed to create stock" },
      { status: 500 }
    );
  }
}
