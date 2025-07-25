
"use client";

import { StockTable } from "@/components/stock-manager/stock-table";

export default function StockPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Management</h1>
      <StockTable />
    </div>
  );
}
