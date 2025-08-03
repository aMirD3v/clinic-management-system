
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stock } from "@prisma/client";

interface StockFormProps {
  defaultValues: Partial<Stock>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}
export function StockForm({ defaultValues, onSubmit, isSubmitting }: StockFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="medicineName">Medicine Name</Label>
        <Input id="medicineName" {...register("medicineName", { required: "Medicine Name is required" })} className={errors.medicineName ? "border-red-500" : ""} />
        {errors.medicineName && <p className="text-red-500 text-sm">{errors.medicineName.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" {...register("quantity", { required: "Quantity is required", valueAsNumber: true })} className={errors.quantity ? "border-red-500" : ""} />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit">Unit</Label>
        <Input id="unit" {...register("unit", { required: "Unit is required" })} className={errors.unit ? "border-red-500" : ""} />
        {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" {...register("price", { required: "Price is required", valueAsNumber: true })} className={errors.price ? "border-red-500" : ""} />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input id="expiryDate" type="date" {...register("expiryDate", { required: "Expiry Date is required", valueAsDate: true })} className={errors.expiryDate ? "border-red-500" : ""} />
        {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="reorderLevel">Reorder Level</Label>
        <Input id="reorderLevel" type="number" {...register("reorderLevel", { valueAsNumber: true })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white hover:bg-blue-600">
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
