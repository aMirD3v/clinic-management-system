
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/admin/visits-columns";
import { Visit, VisitStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToCsv } from "@/lib/utils/export";


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

export default function VisitorReportPage() {
  const [visits, setVisits] = useState<VisitWithStudentInfo[]>([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    waitingForNurse: 0,
    readyForDoctor: 0,
    completed: 0,
    sentToLab: 0,
    labResultsReady: 0,
    readyForPharmacy: 0,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedStatus, setSelectedStatus] = useState<VisitStatus | "all">("all");

  async function fetchVisits() {
    let url = "/api/admin/visits";
    const params = new URLSearchParams();

    if (dateRange?.from) {
      params.append("fromDate", dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      params.append("toDate", dateRange.to.toISOString());
    }
    if (selectedStatus !== "all") {
      params.append("status", selectedStatus);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    const data: VisitWithStudentInfo[] = await res.json();
    setVisits(data);

    const newStats = {
      totalVisits: data.length,
      waitingForNurse: data.filter(v => v.status === VisitStatus.WAITING_FOR_NURSE).length,
      readyForDoctor: data.filter(v => v.status === VisitStatus.READY_FOR_DOCTOR).length,
      completed: data.filter(v => v.status === VisitStatus.COMPLETED).length,
      sentToLab: data.filter(v => v.status === VisitStatus.SENT_TO_LAB).length,
      labResultsReady: data.filter(v => v.status === VisitStatus.LAB_RESULTS_READY).length,
      readyForPharmacy: data.filter(v => v.status === VisitStatus.READY_FOR_PHARMACY).length,
    };
    setStats(newStats);
  }

  useEffect(() => {
    fetchVisits();
  }, [dateRange, selectedStatus]);

  const handleExport = () => {
    const headers = [
      "ID",
      "Student ID",
      "Reason",
      "Status",
      "Assigned Doctor ID",
      "Created At",
      "Updated At",
    ];
    const data = visits.map((visit) => ({
      ID: visit.id,
      "Student ID": visit.studentId,
      Reason: visit.reason,
      Status: visit.status,
      "Assigned Doctor ID": visit.assignedDoctorId || "N/A",
      "Created At": new Date(visit.createdAt).toLocaleDateString(),
      "Updated At": new Date(visit.updatedAt).toLocaleDateString(),
    }));
    exportToCsv(headers, data, "visitor_report");
  };

  const handleVisitUpdated = () => {
    fetchVisits();
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visitor Report</h2>
          <p className="text-muted-foreground">
            Detailed report on clinic visitors.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport}>Export to CSV</Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 py-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  ` ${format(dateRange.from, "LLL dd, y")}
                    - ${format(dateRange.to, "LLL dd, y")}`
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select
          onValueChange={(value: VisitStatus | "all") => setSelectedStatus(value)}
          value={selectedStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(VisitStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Visits
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
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Waiting for Nurse
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
            <div className="text-2xl font-bold">{stats.waitingForNurse}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
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
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Doctor</CardTitle>
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
              <path d="M12 2v20M17 5H7l-2 10h14l-2 10z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readyForDoctor}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold tracking-tight mb-4">Recent Visits</h3>
        <DataTable data={visits} columns={columns({ onVisitUpdated: handleVisitUpdated })} filterableColumn="studentId" />
      </div>
    </div>
  );
}
