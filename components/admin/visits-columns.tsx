
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Visit, VisitStatus, Prisma } from "@prisma/client";
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
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VisitWithStudentInfo = Prisma.VisitGetPayload<{
  include: { studentInfo: true };
}>;

interface ColumnsProps {
  onVisitUpdated: () => void;
}

export const columns = ({ onVisitUpdated }: ColumnsProps): ColumnDef<VisitWithStudentInfo>[] => [
 
  {
    accessorKey: "studentId",
    header: "Student ID",
  },
   {
    accessorKey: "studentInfo.fullName",
    header: "Student Name",
    cell: ({ row }) => {
      const studentInfo = row.original.studentInfo;
      return studentInfo ? studentInfo.fullName : "N/A";
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const visit = row.original;

      const handleStatusChange = async (newStatus: VisitStatus) => {
        const res = await fetch(`/api/admin/visits/${visit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (res.ok) {
          toast.success("Visit status updated successfully!");
          onVisitUpdated();
        } else {
          toast.error("Failed to update visit status.");
        }
      };

      return (
        <Select onValueChange={handleStatusChange} defaultValue={visit.status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Change Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(VisitStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const visit = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(visit.id)}
            >
              Copy visit ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View visit details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
