// app/(dashboard)/admin/visits/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/admin/visits-columns";
import { Visit } from "@prisma/client";

type VisitWithStudentInfo = Visit & {
  studentInfo: {
    id: string;
    studentId: string;
    fullName: string;
    gender: string;
    age: number | null;
    email: string | null;
    phone: string | null;
    college: string | null;
    department: string | null;
    profileImageUrl: string | null;
  } | null;
};


export default function VisitsPage() {
  const [visits, setVisits] = useState<VisitWithStudentInfo[]>([]);

  async function fetchVisits() {
    const res = await fetch("/api/admin/visits");
    const data = await res.json();
    setVisits(data);
  }

  useEffect(() => {
    fetchVisits();
  }, []);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patient Visits</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all patient visits in the system.
          </p>
        </div>
      </div>
      <DataTable data={visits} columns={columns({ onVisitUpdated: fetchVisits })} filterableColumn="studentId" />
    </div>
  );
}
