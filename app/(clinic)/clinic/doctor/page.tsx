// app/(clinic)/clinic/doctor/page.tsx
"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns"; // Import parseISO for safer date parsing
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOut } from "next-auth/react";
import {
  UserCheck,
  Heart,
  Thermometer,
  Activity,
  Weight,
  Clock,
  User,
  FileText,
  Stethoscope,
  Pill,
  TestTube,
  LogOut,
  Users,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ClipboardList,
  ArrowLeft,
  Search,
  CalendarDays, // Added
  CheckCircle, // Added
  Beaker, // Added
  WeightIcon, // Added (if different from Weight)
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Make sure this component exists

// --- Updated/Extended Types ---
// Enhance the Visit type to match the data fetched by the updated API route for the *current* visit
type DetailedVisit = {
  id: string;
  studentId: string;
  reason: string;
  status: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  assignedDoctorId: string | null;
  // Include full related data fetched by the API
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
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  } | null;
  nurseNote: {
    id: string;
    visitId: string;
    bloodPressure: string;
    temperature: string;
    pulse: string;
    weight: string;
    notes: string | null;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  } | null;
  doctorNote: {
    id: string;
    visitId: string;
    diagnosis: string;
    prescription: string | null;
    requestLabTest: boolean;
    labTests: string | null; // JSON string
    notes: string | null;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  } | null;
  labResult: {
    id: string;
    visitId: string;
    results: string; // JSON string
    notes: string | null;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  } | null;
  pharmacyNote: {
    id: string;
    visitId: string;
    stockId: string;
    quantity: number;
    notes: string | null;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    stock: {
      medicineName: string;
      description: string | null;
      unit: string;
    } | null;
  } | null;
  // assignedDoctor: { id: string; name: string } | null; // Add if included
};

// Type for previous visits fetched
type PreviousVisitSummary = {
  id: string;
  studentId: string;
  reason: string;
  status: string;
  createdAt: string; // ISO string
  doctorNote: {
    diagnosis: string;
    prescription: string | null;
    createdAt: string; // ISO string
  } | null;
  nurseNote: {
    bloodPressure: string;
    temperature: string;
    pulse: string;
    weight: string;
    createdAt: string; // ISO string
  } | null;
  labResult: {
    id: string;
    createdAt: string; // ISO string
  } | null;
  pharmacyNote: {
    id: string;
    createdAt: string; // ISO string
    stock: {
      medicineName: string;
    } | null;
  } | null;
  // assignedDoctor: { name: string } | null; // Add if included
};

type LabTestCategory = {
  id: string;
  name: string;
  tests: LabTest[];
};

type LabTest = {
  id: string;
  name: string;
  selected: boolean;
};

// grouped lab-result types
type LabTestResult = {
  testName: string;
  result: string;
  normalRange: string;
};

type LabResultCategory = {
  category: string;
  tests: LabTestResult[];
};
// --- End Updated/Extended Types ---

// Helper to safely format dates
const safeFormatDate = (
  dateString: string | undefined,
  formatString: string = "MMM dd, yyyy HH:mm"
) => {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), formatString);
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Invalid Date";
  }
};

export default function DoctorPanel() {
  const [visits, setVisits] = useState<DetailedVisit[]>([]); // Changed type
  const [filteredVisits, setFilteredVisits] = useState<DetailedVisit[]>([]); // Changed type
  const [loading, setLoading] = useState(true);
  const [submittingVisits, setSubmittingVisits] = useState<Set<string>>(
    new Set()
  );
  const [selectedVisit, setSelectedVisit] = useState<DetailedVisit | null>(
    null
  ); // Changed type
  const [searchTerm, setSearchTerm] = useState("");
  const [labTests, setLabTests] = useState<LabTestCategory[]>([]);
  const [requestLabTestChecked, setRequestLabTestChecked] = useState(false);
  const [parsedLabResults, setParsedLabResults] = useState<
    LabResultCategory[] | null
  >(null);
  const [previousVisitsForPatient, setPreviousVisitsForPatient] = useState<
    PreviousVisitSummary[]
  >([]); // NEW STATE

  /* ------------------------------------------------------------------ */
  /*  Lab-test catalogue                                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const initialLabTests: LabTestCategory[] = [
      {
        id: "hematology",
        name: "HEMOTOLOGY & ODER REPORT FORM",
        tests: [
          { id: "rbc", name: "RBC", selected: false },
          { id: "hemoglobin", name: "Hemoglobin", selected: false },
          { id: "hematocrit", name: "Hematocrit", selected: false },
          { id: "mcv", name: "MCV", selected: false },
          { id: "mch", name: "MCH", selected: false },
          { id: "mchc", name: "MCHC", selected: false },
          { id: "wbc", name: "WBC", selected: false },
          { id: "differential", name: "Differential", selected: false },
          { id: "lymphocyte", name: "Lymphocyte", selected: false },
          { id: "eosinophil", name: "Eosinophil", selected: false },
          { id: "basophil", name: "Basophil", selected: false },
          { id: "monocyte", name: "Monocyte", selected: false },
          { id: "esr", name: "ESR", selected: false },
          { id: "platelet_count", name: "Platelet Count", selected: false },
          { id: "bleeding_time", name: "Bleeding Time", selected: false },
          { id: "clot_retraction", name: "Clot Retraction", selected: false },
          { id: "coagulation_time", name: "Coagulation Time", selected: false },
          { id: "pt", name: "PT", selected: false },
          { id: "ptt", name: "PTT", selected: false },
          { id: "inr", name: "INR", selected: false },
          { id: "fibrinogen", name: "Fibrinogen", selected: false },
          { id: "d_dimer", name: "D-Dimer", selected: false },
          { id: "cd4", name: "CD4 (Absolute)", selected: false },
          { id: "blood_films", name: "Blood Films", selected: false },
          { id: "p_morphology", name: "P. Morphology", selected: false },
          { id: "blood_group", name: "Blood Group & Rh", selected: false },
          { id: "gross_match", name: "Gross Match", selected: false },
        ],
      },
      {
        id: "serology",
        name: "SEROLOGY & ORDER REPORT FORM",
        tests: [
          { id: "vdrl", name: "VDRL", selected: false },
          { id: "rpr", name: "RPR", selected: false },
          { id: "widal", name: "WIDAL", selected: false },
          { id: "weil_felix", name: "WEIL-FELIX", selected: false },
          { id: "hbs_ag", name: "HBs Ag", selected: false },
          { id: "hcv_ab", name: "HCV-Ab", selected: false },
        ],
      },
      {
        id: "urine",
        name: "URINE & ODER REPORT FORM",
        tests: [
          { id: "colour", name: "COLOUR", selected: false },
          { id: "appearance", name: "APPEARANCE", selected: false },
          { id: "blood", name: "BLOOD", selected: false },
          { id: "bitrubin", name: "BITRUBIN", selected: false },
          { id: "urobilinogen", name: "UROBILINOGEN", selected: false },
          { id: "ketone", name: "KETONE", selected: false },
          { id: "albumin", name: "ALBUMIN", selected: false },
          { id: "netrite", name: "NETRITE", selected: false },
          { id: "ph", name: "PH", selected: false },
          { id: "sp_gravity", name: "SP.GRAVITY", selected: false },
          { id: "leucocyte", name: "LEUCOCYTE", selected: false },
          { id: "pus_cells", name: "PUS CELLS/Wbe", selected: false },
          { id: "rbc1", name: "RBC", selected: false },
          { id: "casts", name: "Casts", selected: false },
          { id: "others", name: "Others", selected: false },
        ],
      },
      {
        id: "stool",
        name: "STOOL EXAM ORDER AND REPORT FORM",
        tests: [
          { id: "appearance1", name: "Appearance", selected: false },
          { id: "consistency", name: "Consistency", selected: false },
          { id: "mucus", name: "Mucus", selected: false },
          { id: "plus_cells", name: "Plus Cells", selected: false },
          { id: "gross_blood", name: "Gross Blood", selected: false },
          { id: "occult_blood", name: "Occult Blood", selected: false },
          { id: "ova_larvac", name: "Ova/Larvac of parasite", selected: false },
          { id: "bacteria", name: "Bacteria", selected: false },
        ],
      },
    ];
    setLabTests(initialLabTests);
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Fetch visits (List View)                                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    fetchData(); // Fetch initial list of visits awaiting doctor
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVisits(visits);
    } else {
      const filtered = visits.filter((visit) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          visit.studentId.toLowerCase().includes(searchLower) ||
          visit.studentInfo?.fullName?.toLowerCase().includes(searchLower) ||
          visit.reason.toLowerCase().includes(searchLower) ||
          visit.studentInfo?.college?.toLowerCase().includes(searchLower) ||
          visit.studentInfo?.department?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredVisits(filtered);
    }
  }, [searchTerm, visits]);

  /* ------------------------------------------------------------------ */
  /*  Parse / group lab results (for current visit display)             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (selectedVisit?.labResult?.results) {
      try {
        // flat structure -> grouped
        const flat: Array<{
          category: string;
          testName: string;
          result: string;
          normalRange: string;
        }> = JSON.parse(selectedVisit.labResult.results);
        const grouped: LabResultCategory[] = flat.reduce<LabResultCategory[]>(
          (acc, cur) => {
            let cat = acc.find((c) => c.category === cur.category);
            if (!cat) {
              cat = { category: cur.category, tests: [] };
              acc.push(cat);
            }
            cat.tests.push({
              testName: cur.testName,
              result: cur.result,
              normalRange: cur.normalRange,
            });
            return acc;
          },
          []
        );
        setParsedLabResults(grouped);
      } catch (error) {
        console.error("Failed to parse / group lab results:", error);
        setParsedLabResults(null);
      }
    } else {
      setParsedLabResults(null);
    }
  }, [selectedVisit]);

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clinic/doctor/visits"); // Fetches list for the view
      const data = await res.json();
      setVisits(data);
      setFilteredVisits(data);
    } catch (error) {
      toast.error("Failed to load patient data");
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to fetch detailed visit data (including previous visits)
  const fetchDetailedVisit = async (visitId: string) => {
    try {
      const res = await fetch(`/api/clinic/doctor/${visitId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to load visit details");
      }
      const data = await res.json();
      // Assuming the API now returns { visit: DetailedVisit, previousVisits: PreviousVisitSummary[] }
      setSelectedVisit(data.visit); // Set the detailed visit
      setPreviousVisitsForPatient(data.previousVisits); // Set the previous visits
    } catch (error) {
      console.error("Error fetching detailed visit:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load visit details"
      );
    }
  };

  const handleTestChange = (categoryId: string, testId: string) => {
    setLabTests((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tests: category.tests.map((test) =>
                test.id === testId
                  ? { ...test, selected: !test.selected }
                  : test
              ),
            }
          : category
      )
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    visitId: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const diagnosis = formData.get("diagnosis") as string;
    if (!diagnosis?.trim()) {
      toast.error("Please enter a diagnosis");
      return;
    }
    setSubmittingVisits((prev) => new Set(prev).add(visitId));
    const payload = {
      diagnosis,
      prescription: formData.get("prescription"),
      requestLabTest: formData.get("requestLabTest") === "on",
      labTests: labTests
        .map((category) => ({
          category: category.name,
          tests: category.tests
            .filter((test) => test.selected)
            .map((test) => test.name),
        }))
        .filter((c) => c.tests.length > 0),
      notes: formData.get("notes"),
    };
    try {
      const res = await fetch(`/api/clinic/doctor/${visitId}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Diagnosis submitted successfully!");
        fetchData(); // Refresh the list view
        setSelectedVisit(null); // Go back to list or stay on detail? Up to you.
        setPreviousVisitsForPatient([]); // Clear previous visits state
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to submit diagnosis");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit diagnosis");
    } finally {
      setSubmittingVisits((prev) => {
        const newSet = new Set(prev);
        newSet.delete(visitId);
        return newSet;
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading patient data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedVisit ? (
          /* ----------------------------------------------------------
             Visits List View
          -----------------------------------------------------------*/
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5 text-sky-500" />
                    <span>Patient Consultations</span>
                  </CardTitle>
                  <CardDescription>
                    Select a patient to view details and provide diagnosis
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-10 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredVisits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    {searchTerm ? (
                      <Search className="w-8 h-8 text-gray-400" />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {searchTerm
                      ? "No matching patients found"
                      : "No Patients Waiting"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "Try a different search term"
                      : "All patients have been seen. New patients will appear here when they're ready for consultation."}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      className="mt-4"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredVisits.map((visit) => (
                    <Card
                      key={visit.id}
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-sky-500 bg-white dark:bg-gray-900"
                      // onClick={() => setSelectedVisit(visit)} // OLD
                      onClick={() => fetchDetailedVisit(visit.id)} // NEW: Fetch detailed data
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {visit.studentInfo?.profileImageUrl ? (
                              <img
                                src={
                                  visit.studentInfo.profileImageUrl ||
                                  "/placeholder.svg"
                                }
                                alt="Patient photo"
                                className="rounded-lg object-cover border-2 border-white shadow-lg w-12 h-12"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-sky-600" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {visit.studentInfo?.fullName ||
                                  `Student ${visit.studentId}`}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                ID: {visit.studentId}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {visit.reason}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="flex items-center space-x-2">
                                     {visit.labResult && (
                                <div>
                                  <Badge className="flex items-center gap-1 bg-green-500 text-white dark:bg-green-700 dark:text-green-100">
                                    <Beaker className="w-3 h-3" />
                                    <span>Lab Results Available</span>
                                  </Badge>
                                </div>
                              )}
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {safeFormatDate(
                                  visit.createdAt,
                                  "MMM dd, HH:mm"
                                )}{" "}
                                {/* Use helper */}
                              </span>
                       
                            </div>

                            {visit.nurseNote && (
                              <Badge variant="secondary" className="text-xs">
                                Vitals Recorded
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              className="bg-sky-500 hover:bg-sky-600 text-white"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Consult
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-sky-100 dark:border-sky-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-sky-500" />
                    <span>Patient Consultation</span>
                  </CardTitle>
                  <CardDescription>
                    {selectedVisit.studentInfo?.fullName ||
                      selectedVisit.studentId}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Clock className="w-3 h-3" />
                    <span>
                      {safeFormatDate(
                        selectedVisit.createdAt,
                        "MMM dd, hh:mm a"
                      )}{" "}
                      {/* Use helper */}
                    </span>
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedVisit(null);
                      setPreviousVisitsForPatient([]); // Clear previous visits when going back
                    }}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to List</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {" "}
              {/* Reduced padding slightly */}
              <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl border border-gray-100 dark:border-gray-700">
                {/* ... existing patient info JSX, adjust to use selectedVisit.studentInfo ... */}
                <div className="flex-shrink-0">
                  {selectedVisit.studentInfo?.profileImageUrl ? (
                    <img
                      src={selectedVisit.studentInfo.profileImageUrl}
                      alt="Patient photo"
                      className="rounded-lg object-cover border-2 border-white shadow-lg w-20 h-24"
                    />
                  ) : (
                    <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center border-2 border-white shadow-lg">
                      <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedVisit.studentInfo?.fullName || "Unknown Patient"}
                    </h3>
                    <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">
                      Student ID: {selectedVisit.studentId}
                    </p>
                  </div>
                  {/* ... rest of patient info fields using selectedVisit.studentInfo ... */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedVisit.studentInfo?.gender && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        <span>{selectedVisit.studentInfo.gender}</span>
                      </div>
                    )}
                    {selectedVisit.studentInfo?.age && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedVisit.studentInfo.age} years</span>
                      </div>
                    )}
                    {selectedVisit.studentInfo?.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4" />
                        <span>{selectedVisit.studentInfo.phone}</span>
                      </div>
                    )}
                    {selectedVisit.studentInfo?.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4" />
                        <span>{selectedVisit.studentInfo.email}</span>
                      </div>
                    )}
                  </div>
                  {selectedVisit.studentInfo?.college && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <GraduationCap className="w-4 h-4" />
                        <span>{selectedVisit.studentInfo.college}</span>
                      </div>
                      {selectedVisit.studentInfo.department && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedVisit.studentInfo.department}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      <strong>Chief Complaint:</strong> {selectedVisit.reason}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Visit Created: {safeFormatDate(selectedVisit.createdAt)}{" "}
                      {/* Use helper */}
                    </p>
                  </div>
                </div>
              </div>
              {/* Vital Signs - Use selectedVisit.nurseNote */}
              {selectedVisit.nurseNote && (
                <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-sky-700 dark:text-sky-300 mb-4">
                    <Stethoscope className="w-5 h-5" />
                    <span>
                      Vital Signs (Recorded:{" "}
                      {safeFormatDate(selectedVisit.nurseNote.createdAt)})
                    </span>{" "}
                    {/* Use helper */}
                  </h3>
                  {/* ... existing vitals grid using selectedVisit.nurseNote ... */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* ... BP, Temp, Pulse, Weight ... */}
                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <Heart className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Blood Pressure
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedVisit.nurseNote.bloodPressure}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <Thermometer className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Temperature
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedVisit.nurseNote.temperature}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pulse Rate
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedVisit.nurseNote.pulse}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <Weight className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Weight
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedVisit.nurseNote.weight}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedVisit.nurseNote.notes && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Nurse Notes:</strong>{" "}
                        {selectedVisit.nurseNote.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {/* Lab Results - Use selectedVisit.labResult */}
              {selectedVisit.labResult && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4">
                    <TestTube className="w-5 h-5" />
                    <span>
                      Laboratory Results (Received:{" "}
                      {safeFormatDate(selectedVisit.labResult.createdAt)})
                    </span>{" "}
                    {/* Use helper */}
                  </h3>
                  {/* ... existing lab results display using selectedVisit.labResult ... */}
                  {parsedLabResults?.length ? (
                    <div className="space-y-6">
                      {parsedLabResults.map((category, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-bold mb-3 text-blue-800 dark:text-blue-200">
                            {category.category}
                          </h4>
                          {/* ... table content ... */}
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left pb-2 text-sm font-medium">
                                  Test
                                </th>
                                <th className="text-left pb-2 text-sm font-medium">
                                  Result
                                </th>
                                <th className="text-left pb-2 text-sm font-medium">
                                  Normal Range
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.tests.map((test, testIndex) => (
                                <tr key={testIndex} className="border-b">
                                  <td className="py-3 text-sm">
                                    {test.testName}
                                  </td>
                                  <td className="py-3 text-sm font-medium">
                                    {test.result}
                                  </td>
                                  <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {test.normalRange}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {/* Handle case where results aren't parsed or are a simple string */}
                        {selectedVisit.labResult.results ||
                          "Results available but format unknown."}
                      </p>
                    </div>
                  )}
                  {selectedVisit.labResult.notes && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Lab Notes:</strong>{" "}
                        {selectedVisit.labResult.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {/* Pharmacy Notes (if any) */}
              {selectedVisit.pharmacyNote && (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-green-700 dark:text-green-300 mb-4">
                    <Pill className="w-5 h-5" />
                    <span>
                      Pharmacy Dispensed (On:{" "}
                      {safeFormatDate(selectedVisit.pharmacyNote.createdAt)})
                    </span>{" "}
                    {/* Use helper */}
                  </h3>
                  <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedVisit.pharmacyNote.stock?.medicineName ||
                          "Medication"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Quantity: {selectedVisit.pharmacyNote.quantity}{" "}
                        {selectedVisit.pharmacyNote.stock?.unit || "unit(s)"}
                      </p>
                      {selectedVisit.pharmacyNote.stock?.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {selectedVisit.pharmacyNote.stock.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedVisit.pharmacyNote.notes && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Pharmacist Notes:</strong>{" "}
                        {selectedVisit.pharmacyNote.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {/* Previous Visits Summary Card */}
              {previousVisitsForPatient.length > 0 && (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4">
                    <ClipboardList className="w-5 h-5" />
                    <span>
                      Recent Visit History (Last{" "}
                      {previousVisitsForPatient.length})
                    </span>
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {" "}
                    {/* Scrolling container */}
                    {previousVisitsForPatient.map((prevVisit) => (
                      <div
                        key={prevVisit.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {prevVisit.doctorNote?.diagnosis}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {safeFormatDate(prevVisit.createdAt)}{" "}
                              {/* Use helper */}
                            </p>
                          </div>
                        </div>

                        {/* Summary of previous visit details */}
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex flex-wrap gap-2 text-xs">
                          {prevVisit.doctorNote && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="flex items-center cursor-help"
                                  >
                                    <Stethoscope className="w-3 h-3 mr-1" />
                                    <span>Diagnosis</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="max-w-xs p-3 bg-gray-800 text-white text-xs rounded-md"
                                >
                                  <p>
                                    <span className="font-medium">
                                      Diagnosis:
                                    </span>
                                  </p>
                                  <p className="mt-1">
                                    {prevVisit.doctorNote.diagnosis ||
                                      "Diagnosis recorded but empty."}
                                  </p>
                                  {prevVisit.doctorNote.prescription && (
                                    <>
                                      <p className="mt-2 font-medium">
                                        Prescription:
                                      </p>
                                      <p className="mt-1 whitespace-pre-wrap">
                                        {prevVisit.doctorNote.prescription}
                                      </p>
                                    </>
                                  )}
                                  <p className="mt-2 text-gray-400 text-xs">
                                    Recorded:{" "}
                                    {safeFormatDate(
                                      prevVisit.doctorNote.createdAt
                                    )}{" "}
                                    {/* Use helper */}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {prevVisit.nurseNote && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="flex items-center cursor-help"
                                  >
                                    <Heart className="w-3 h-3 mr-1" />
                                    <span>Vitals</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className=" p-3 bg-gray-800 text-white text-xs rounded-md"
                                >
                                  <p className="font-medium">Vital Signs:</p>
                                  <ul className="mt-1 space-y-1">
                                    <li>
                                      BP: {prevVisit.nurseNote.bloodPressure}
                                    </li>
                                    <li>
                                      Temp: {prevVisit.nurseNote.temperature}
                                    </li>
                                    <li>Pulse: {prevVisit.nurseNote.pulse}</li>
                                    <li>
                                      Weight: {prevVisit.nurseNote.weight}
                                    </li>
                                  </ul>
                                  <p className="mt-2 text-gray-400 text-xs">
                                    Recorded:{" "}
                                    {safeFormatDate(
                                      prevVisit.nurseNote.createdAt
                                    )}{" "}
                                    {/* Use helper */}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {prevVisit.labResult && (
                            <Badge
                              variant="outline"
                              className="flex items-center"
                            >
                              <TestTube className="w-3 h-3 mr-1" />
                              <span>Lab Done</span>
                              <span className="ml-1 text-gray-500 dark:text-gray-400 text-xs">
                                ({safeFormatDate(prevVisit.labResult.createdAt)}
                                ) {/* Use helper */}
                              </span>
                            </Badge>
                          )}
                          {prevVisit.pharmacyNote && (
                            <Badge
                              variant="outline"
                              className="flex items-center"
                            >
                              <Pill className="w-3 h-3 mr-1" />
                              <span>Dispensed</span>
                              {prevVisit.pharmacyNote.stock && (
                                <span className="ml-1">
                                  ({prevVisit.pharmacyNote.stock.medicineName})
                                </span>
                              )}
                              <span className="ml-1 text-gray-500 dark:text-gray-400 text-xs">
                                (
                                {safeFormatDate(
                                  prevVisit.pharmacyNote.createdAt
                                )}
                                ) {/* Use helper */}
                              </span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Separator />
              {/* Diagnosis Form - Keep mostly as is, adjust if needed */}
              <form
                onSubmit={(e) => handleSubmit(e, selectedVisit.id)}
                className="space-y-6"
              >
                {/* ... existing form fields ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Diagnosis Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`diagnosis-${selectedVisit.id}`}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4 text-sky-500" />
                      <span>Diagnosis *</span>
                    </Label>
                    <Input
                      id={`diagnosis-${selectedVisit.id}`}
                      name="diagnosis"
                      placeholder="Enter primary diagnosis..."
                      required
                      className="h-12"
                      // Pre-fill if editing? Usually not for new diagnosis
                      // defaultValue={selectedVisit.doctorNote?.diagnosis || ""}
                    />
                  </div>
                  {/* Prescription Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`prescription-${selectedVisit.id}`}
                      className="flex items-center space-x-2"
                    >
                      <Pill className="w-4 h-4 text-blue-500" />
                      <span>Prescription</span>
                    </Label>
                    <Input
                      id={`prescription-${selectedVisit.id}`}
                      name="prescription"
                      placeholder="Medications and dosage..."
                      className="h-12"
                      // Pre-fill if editing?
                      // defaultValue={selectedVisit.doctorNote?.prescription || ""}
                    />
                  </div>
                </div>
                {/* Clinical Notes */}
                <div className="space-y-2">
                  <Label
                    htmlFor={`notes-${selectedVisit.id}`}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Clinical Notes</span>
                  </Label>
                  <Textarea
                    id={`notes-${selectedVisit.id}`}
                    name="notes"
                    placeholder="Additional clinical observations, treatment plan, follow-up instructions..."
                    className="min-h-[100px] resize-none"
                    // Pre-fill if editing?
                    // defaultValue={selectedVisit.doctorNote?.notes || ""}
                  />
                </div>
                {/* Request Lab Test Checkbox - Logic stays similar, but check if lab already done */}
                {selectedVisit.labResult ? ( // If result already exists, don't show request checkbox
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center">
                      <ClipboardCheck className="w-4 h-4 mr-2" />
                      Laboratory tests have already been completed for this
                      visit. See results above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <Checkbox
                        id={`lab-${selectedVisit.id}`}
                        name="requestLabTest"
                        checked={requestLabTestChecked}
                        onCheckedChange={(checked) =>
                          setRequestLabTestChecked(!!checked)
                        }
                      />
                      <Label
                        htmlFor={`lab-${selectedVisit.id}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <TestTube className="w-4 h-4 text-purple-500" />
                        <span>Request Laboratory Test</span>
                      </Label>
                    </div>
                    {requestLabTestChecked && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                        {/* ... existing lab test selection UI ... */}
                        <h4 className="font-medium mb-4 text-gray-900 dark:text-white">
                          Select Tests to Request
                        </h4>
                        <div className="space-y-6">
                          {labTests.map((category) => (
                            <div key={category.id} className="space-y-3">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {category.name}
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {category.tests.map((test) => (
                                  <div
                                    key={test.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`test-${test.id}`}
                                      checked={test.selected}
                                      onCheckedChange={() =>
                                        handleTestChange(category.id, test.id)
                                      }
                                    />
                                    <Label
                                      htmlFor={`test-${test.id}`}
                                      className="text-sm"
                                    >
                                      {test.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Submit Button - Keep as is */}
                <Button
                  type="submit"
                  disabled={submittingVisits.has(selectedVisit.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg font-medium"
                >
                  {/* ... existing button content ... */}
                  {submittingVisits.has(selectedVisit.id) ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Diagnosis...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-5 h-5" />
                      <span>Submit Diagnosis & Complete Visit</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
