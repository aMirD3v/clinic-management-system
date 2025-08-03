
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Stock } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditStockForm } from "./edit-stock-form";
import { useState } from "react";

interface ColumnsProps {
  onStockUpdated: () => void;
}

export const columns = ({ onStockUpdated }: ColumnsProps): ColumnDef<Stock>[] => [
  {
    accessorKey: "medicineName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Medicine Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiryDate"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const stock = row.original;
      const [open, setOpen] = useState(false);

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(stock.id)}
              >
                Copy stock ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
                >
                  Edit stock
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                onClick={async () => {
                  const res = await fetch(`/api/admin/stock/${stock.id}`, {
                    method: "DELETE",
                  });
                  if (res.ok) {
                    toast.success("Stock deleted successfully!");
                    onStockUpdated();
                  } else {
                    toast.error("Failed to delete stock.");
                  }
                }}
              >
                Delete stock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Stock</DialogTitle>
              <DialogDescription>
                Edit the stock details below.
              </DialogDescription>
            </DialogHeader>
            <EditStockForm
              stock={stock}
              setOpen={setOpen}
              onStockUpdated={onStockUpdated}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
