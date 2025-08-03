
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Stock } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  medicineName: z.string().min(2, "Medicine name must be at least 2 characters."),
  description: z.string().optional(),
  batchNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  unit: z.string().min(1, "Unit is required."),
  price: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  expiryDate: z.string().min(1, "Expiry date is required."),
  manufactureDate: z.string().optional(),
  reorderLevel: z.coerce.number().optional(),
  maxStockLevel: z.coerce.number().optional(),
  storageLocation: z.string().optional(),
  notes: z.string().optional(),
});

interface EditStockFormProps {
  setOpen: (open: boolean) => void;
  stock: Stock;
  onStockUpdated: () => void;
}

export function EditStockForm({
  setOpen,
  stock,
  onStockUpdated,
}: EditStockFormProps) {
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      medicineName: stock.medicineName,
      description: stock.description || "",
      batchNumber: stock.batchNumber || "",
      manufacturer: stock.manufacturer || "",
      quantity: stock.quantity,
      unit: stock.unit,
      price: stock.price || 0,
      costPrice: stock.costPrice || 0,
      expiryDate: new Date(stock.expiryDate).toISOString().split('T')[0],
      manufactureDate: stock.manufactureDate?.toISOString().split('T')[0] || "",
      reorderLevel: stock.reorderLevel || 0,
      maxStockLevel: stock.maxStockLevel || 0,
      storageLocation: stock.storageLocation || "",
      notes: stock.notes || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(`/api/admin/stock/${stock.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast.success("Stock updated successfully!");
      onStockUpdated();
      setOpen(false);
    } else {
      toast.error("Failed to update stock.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="medicineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicine Name</FormLabel>
              <FormControl>
                <Input placeholder="Paracetamol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Pain reliever" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Number</FormLabel>
              <FormControl>
                <Input placeholder="BATCH123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="ABC Pharma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="tablets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufactureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacture Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reorderLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder Level</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxStockLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Stock Level</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="storageLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storage Location</FormLabel>
              <FormControl>
                <Input placeholder="Shelf A3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
