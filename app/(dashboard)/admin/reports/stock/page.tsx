
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/admin/stock-columns";
import { Stock } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToCsv } from "@/lib/utils/export";

export default function StockReportPage() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [stats, setStats] = useState({
    totalStockItems: 0,
    expiringSoon: 0,
    outOfStock: 0,
  });
  const [filterBy, setFilterBy] = useState<"all" | "expiringSoon" | "outOfStock">("all");

  async function fetchStock() {
    let url = "/api/admin/stock";
    const params = new URLSearchParams();

    if (filterBy === "expiringSoon") {
      params.append("expiringSoon", "true");
    } else if (filterBy === "outOfStock") {
      params.append("outOfStock", "true");
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    const data: Stock[] = await res.json();
    setStock(data);

    const newStats = {
      totalStockItems: data.length,
      expiringSoon: data.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expiryDate < threeMonthsFromNow && item.quantity > 0;
      }).length,
      outOfStock: data.filter(item => item.quantity === 0).length,
    };
    setStats(newStats);
  }

  useEffect(() => {
    fetchStock();
  }, [filterBy]);

  const handleExport = () => {
    const headers = [
      "ID",
      "Medicine Name",
      "Description",
      "Batch Number",
      "Manufacturer",
      "Quantity",
      "Unit",
      "Price",
      "Cost Price",
      "Expiry Date",
      "Manufacture Date",
      "Reorder Level",
      "Max Stock Level",
      "Storage Location",
      "Notes",
    ];
    const data = stock.map((item) => ({
      ID: item.id,
      "Medicine Name": item.medicineName,
      Description: item.description || "N/A",
      "Batch Number": item.batchNumber || "N/A",
      Manufacturer: item.manufacturer || "N/A",
      Quantity: item.quantity,
      Unit: item.unit,
      Price: item.price || "N/A",
      "Cost Price": item.costPrice || "N/A",
      "Expiry Date": new Date(item.expiryDate).toLocaleDateString(),
      "Manufacture Date": item.manufactureDate ? new Date(item.manufactureDate).toLocaleDateString() : "N/A",
      "Reorder Level": item.reorderLevel || "N/A",
      "Max Stock Level": item.maxStockLevel || "N/A",
      "Storage Location": item.storageLocation || "N/A",
      Notes: item.notes || "N/A",
    }));
    exportToCsv(headers, data, "stock_report");
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Report</h2>
          <p className="text-muted-foreground">
            Detailed report on clinic stock.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport}>Export to CSV</Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 py-4">
        <Select
          onValueChange={(value: "all" | "expiringSoon" | "outOfStock") => setFilterBy(value)}
          value={filterBy}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="expiringSoon">Expiring Soon</SelectItem>
            <SelectItem value="outOfStock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Items
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expiring Soon
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-4 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold tracking-tight mb-4">All Stock Items</h3>
        <DataTable data={stock} columns={columns({ onStockUpdated: fetchStock })} filterableColumn="medicineName" />
      </div>
    </div>
  );
}
