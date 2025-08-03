
"use client";

import { useEffect, useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StockForm } from "@/components/admin/stock-form";
import { columns } from "@/components/admin/stock-columns";
import { DataTable } from "@/components/data-table";
import { Stock } from "@prisma/client";

export default function StockPage() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchStock() {
    const res = await fetch("/api/admin/stock");
    const data = await res.json();
    setStock(data);
  }

  useEffect(() => {
    fetchStock();
  }, []);

  const handleStockUpdated = () => {
    fetchStock();
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory / Stock</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the stock items in the system.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Stock</DialogTitle>
                <DialogDescription>
                  Fill in the form below to add a new stock item.
                </DialogDescription>
              </DialogHeader>
              <StockForm setOpen={setOpen} onStockCreated={handleStockUpdated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable data={stock} columns={columns({ onStockUpdated: handleStockUpdated })} />
    </div>
  );
}
