// app/(clinic)/clinic/doctor/page.tsx
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { format } from "date-fns";
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
} from "lucide-react";
import toast from "react-hot-toast";

type Visit = {
  id: string;
  studentId: string;
  reason: string;
  status: string;
  createdAt: string;
  nurseNote?: {
    bloodPressure: string;
    temperature: string;
    pulse: string;
    weight: string;
    notes?: string;
  };
  labResult?: {
    results: string; // JSON string
    notes?: string;
  };
  studentInfo?: {
    fullName: string;
    profileImageUrl?: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
    college: string;
    department: string;
  };
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

export default function DoctorPanel() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingVisits, setSubmittingVisits] = useState<Set<string>>(new Set());
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [labTests, setLabTests] = useState<LabTestCategory[]>([]);
  const [requestLabTestChecked, setRequestLabTestChecked] = useState(false);
  const [parsedLabResults, setParsedLabResults] = useState<LabResultCategory[] | null>(null);

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
  /*  Fetch visits                                                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    fetchData();
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
  /*  Parse / group lab results                                         */
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
      const res = await fetch("/api/clinic/doctor/visits");
      const data = await res.json();
      setVisits(data);
      setFilteredVisits(data);
    } catch (error) {
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  const handleTestChange = (categoryId: string, testId: string) => {
    setLabTests((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tests: category.tests.map((test) =>
                test.id === testId ? { ...test, selected: !test.selected } : test
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
        fetchData();
        setSelectedVisit(null);
      } else {
        toast.error("Failed to submit diagnosis");
      }
    } catch (error) {
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
                      onClick={() => setSelectedVisit(visit)}
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
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(visit.createdAt), "MMM dd, HH:mm")}
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
          /* ----------------------------------------------------------
             Detailed Visit View
          -----------------------------------------------------------*/
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-sky-100 dark:border-sky-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-sky-500" />
                    <span>Patient Consultation</span>
                  </CardTitle>
                  <CardDescription>
                    {selectedVisit.studentInfo?.fullName || selectedVisit.studentId}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Clock className="w-3 h-3" />
                    <span>
                      {format(new Date(selectedVisit.createdAt), "MMM dd, hh:mm a")}
                    </span>
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVisit(null)}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to List</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Patient Information */}
              <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl border border-gray-100 dark:border-gray-700">
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
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              {selectedVisit.nurseNote && (
                <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-sky-700 dark:text-sky-300 mb-4">
                    <Stethoscope className="w-5 h-5" />
                    <span>Vital Signs</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <strong>Nurse Notes:</strong> {selectedVisit.nurseNote.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Lab Results */}
              {selectedVisit.labResult && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4">
                    <TestTube className="w-5 h-5" />
                    <span>Laboratory Results</span>
                  </h3>

                  {parsedLabResults?.length ? (
                    <div className="space-y-6">
                      {parsedLabResults.map((category, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-bold mb-3 text-blue-800 dark:text-blue-200">
                            {category.category}
                          </h4>

                          {Array.isArray(category.tests) && category.tests.length ? (
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left pb-2 text-sm font-medium">Test</th>
                                  <th className="text-left pb-2 text-sm font-medium">Result</th>
                                  <th className="text-left pb-2 text-sm font-medium">Normal Range</th>
                                </tr>
                              </thead>
                              <tbody>
                                {category.tests.map((test, testIndex) => (
                                  <tr key={testIndex} className="border-b">
                                    <td className="py-3 text-sm">{test.testName}</td>
                                    <td className="py-3 text-sm font-medium">{test.result}</td>
                                    <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                                      {test.normalRange}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No tests in this category.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {selectedVisit.labResult.results}
                      </p>
                    </div>
                  )}

                  {selectedVisit.labResult.notes && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Lab Notes:</strong> {selectedVisit.labResult.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Diagnosis Form */}
              <form
                onSubmit={(e) => handleSubmit(e, selectedVisit.id)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    />
                  </div>

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
                    />
                  </div>
                </div>

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
                  />
                </div>

                {selectedVisit.labResult ? null : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <Checkbox
                        id={`lab-${selectedVisit.id}`}
                        name="requestLabTest"
                        checked={requestLabTestChecked}
                        onCheckedChange={(checked) => setRequestLabTestChecked(!!checked)}
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
                                  <div key={test.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`test-${test.id}`}
                                      checked={test.selected}
                                      onCheckedChange={() =>
                                        handleTestChange(category.id, test.id)
                                      }
                                    />
                                    <Label htmlFor={`test-${test.id}`} className="text-sm">
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

                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Please ensure all required fields are completed before
                    submitting the diagnosis.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={submittingVisits.has(selectedVisit.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg font-medium"
                >
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