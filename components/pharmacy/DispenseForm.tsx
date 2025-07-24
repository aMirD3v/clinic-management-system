// components/pharmacy/DispenseForm.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

type DispenseFormProps = {
  visitId: string;
  prescription: string;
  onDispense: (visitId: string, medicines: string[]) => Promise<void>;
  stocks: { id: string; medicineName: string }[];
};

export function DispenseForm({
  visitId,
  prescription,
  onDispense,
  stocks,
}: DispenseFormProps) {
  const [medicines, setMedicines] = useState<string[]>([]);
  const [currentMedicine, setCurrentMedicine] = useState("");

  const handleAddMedicine = () => {
    if (currentMedicine.trim()) {
      setMedicines([...medicines, currentMedicine.trim()]);
      setCurrentMedicine("");
    }
  };

  const handleRemoveMedicine = (index: number) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const handleDispense = async () => {
    if (medicines.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }

    try {
      await onDispense(visitId, medicines);
      toast.success("Medicines dispensed successfully");
      setMedicines([]);
    } catch (error) {
      toast.error("Failed to dispense medicines");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Prescription</Label>
        <p className="text-sm text-gray-600">
          {prescription || "No prescription provided"}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Add Medicine</Label>
        <Label>Select Medicine</Label>
        <div className="flex gap-2">
          <select
            className="border rounded p-2 w-full"
            value={currentMedicine}
            onChange={(e) => setCurrentMedicine(e.target.value)}
          >
            <option value="">-- Select Medicine --</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.medicineName}>
                {stock.medicineName}
              </option>
            ))}
          </select>
          <Button type="button" onClick={handleAddMedicine}>
            Add
          </Button>
        </div>
      </div>

      {medicines.length > 0 && (
        <div className="space-y-2">
          <Label>Medicines to Dispense</Label>
          <ul className="space-y-2">
            {medicines.map((medicine, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{medicine}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMedicine(index)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button className="w-full" onClick={handleDispense}>
        Dispense Medicines
      </Button>
    </div>
  );
}
