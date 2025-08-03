
"use client";

import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockForm } from "./stock-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StockTable() {
  const { data: stock, error, mutate } = useSWR("/api/stock", fetcher);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (error) return <div>Failed to load stock</div>;
  if (!stock) return <div>Loading...</div>;

  const filteredStock = stock.filter((item: any) =>
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = async (data: any) => {
    setIsSubmitting(true);
    await fetch("/api/stock", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    mutate();
    setIsSubmitting(false);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = async (data: any) => {
    setIsSubmitting(true);
    await fetch(`/api/stock/${selectedStock?.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    mutate();
    setIsSubmitting(false);
    setSelectedStock(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/stock/${id}`, {
      method: "DELETE",
    });
    mutate();
  };

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Stock List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search by medicine name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Stock</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Stock</DialogTitle>
              </DialogHeader>
              <StockForm defaultValues={{}} onSubmit={handleAddSubmit} isSubmitting={isSubmitting} />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStock.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.medicineName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => setSelectedStock(item)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Stock</DialogTitle>
                      </DialogHeader>
                      <StockForm defaultValues={selectedStock} onSubmit={handleEditSubmit} isSubmitting={isSubmitting} />
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the stock item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
