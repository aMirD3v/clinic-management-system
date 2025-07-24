// components/pharmacy/VisitList.tsx

"use client";
import { useState } from "react";
import { DispenseForm } from "@/components/pharmacy/DispenseForm";
import toast from "react-hot-toast";
import { Visit } from "@prisma/client";

type VisitListProps = {
  visits: (Visit & {
    studentInfo: { fullName: string; studentId: string } | null;
    doctorNote: { prescription: string | null } | null;
  })[];
  stocks: { id: string; medicineName: string; quantity: number }[];
};

export function VisitList({ visits, stocks }: VisitListProps) {
  return (
    <div className="space-y-2">
      {visits.map((visit) => (
        <div key={visit.id} className="border p-4 rounded-lg">
          <h3 className="font-medium">
            {visit.studentInfo?.fullName || "Unknown Student"}
          </h3>
          <p className="text-sm text-gray-600">
            Student ID: {visit.studentInfo?.studentId || "N/A"}
          </p>
          <p className="mt-2">Reason: {visit.reason}</p>

          <DispenseForm
            visitId={visit.id}
            stocks={stocks}
            prescription={visit.doctorNote?.prescription ?? ""}
            onDispense={async (visitId, medicines) => {
              const res = await fetch("/api/clinic/pharmacy/dispense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitId, medicines }),
              });

              if (!res.ok) {
                toast.error("Dispensing failed");
                throw new Error();
              }

              toast.success("Medicines dispensed");
              // refresh the list (simplest way)
              location.reload();
            }}
            
          />
        </div>
      ))}
    </div>
  );
}