// app/(clinic)/clinic/reception/page.tsx
"use client";
import type React from "react";
import { useState, useEffect } from "react"; // Import useEffect
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOut } from "next-auth/react";
import {
  Search,
  UserPlus,
  Calendar,
  Users,
  Activity,
  LogOut,
  Heart,
  User,
  MapPin,
  GraduationCap,
  Clock,
  AlertCircle,
  FileText, // Import icon for visits
  Stethoscope, // Import icon for doctor
  CalendarDays, // Import CalendarDays for better date icon
  CheckCircle, // Import CheckCircle for completed status
  Beaker, // Import Beaker for lab results
  Pill, // Import Pill for pharmacy
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

// Define types for better type safety
type Student = {
  studentId: string;
  fullName: string;
  gender: string;
  age?: number | null;
  email?: string | null;
  phone?: string | null;
  college?: string | null;
  department?: string | null;
  profileImageUrl?: string | null;
};

type Visit = {
  id: string;
  studentId: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedDoctorId: string | null;
  assignedDoctor: {
    name: string;
  } | null;

  nurseNote: {
    id: string;
    notes: string | null;
  } | null;
  doctorNote: {
    id: string;
    diagnosis: string;
    prescription: string | null;
  } | null;
  labResult: {
    id: string;
  } | null;
  pharmacyNote: {
    id: string;
  } | null;
};

export default function ReceptionPage() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [previousVisits, setPreviousVisits] = useState<Visit[]>([]); // State for visits
  const [loadingVisits, setLoadingVisits] = useState(false); // State for loading visits

  const fetchStudent = async () => {
    if (!studentId.trim()) {
      toast.error("Please enter a student ID");
      return;
    }
    setError("");
    setStudent(null);
    setPreviousVisits([]); // Clear previous visits when searching for a new student
    setIsSearching(true);
    try {
      // Encoding here is fine for the external API call
      const encodedStudentId = encodeURIComponent(studentId);
      const res = await fetch(`/api/students/${encodedStudentId}`);
      if (res.ok) {
        const data: Student = await res.json();
        setStudent(data);
        toast.success("Student found!");
        // Fetch previous visits after finding the student
        await fetchPreviousVisits(studentId);
      } else {
        const { error } = await res.json();
        setError(error);
        toast.error(error || "Student not found");
      }
    } catch (err) {
      setError("Failed to search student");
      toast.error("Failed to search student");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to fetch previous visits
  const fetchPreviousVisits = async (id: string) => {
    setLoadingVisits(true);
    try {
      // Use the original studentId for the internal API call
      const res = await fetch(
        `/api/clinic/reception/visits/${encodeURIComponent(id)}`
      );
      if (res.ok) {
        const data: Visit[] = await res.json();
        setPreviousVisits(data);
      } else {
        console.error("Failed to fetch visits:", await res.text());
        toast.error("Could not load previous visits.");
      }
    } catch (err) {
      console.error("Error fetching visits:", err);
      toast.error("Could not load previous visits.");
    } finally {
      setLoadingVisits(false);
    }
  };

  const registerVisit = async () => {
    // if (!reason.trim()) {
    //   toast.error("Please enter a reason for the visit");
    //   return;
    // }
    setIsRegistering(true);
    try {
      const res = await fetch("/api/clinic/reception/visits", {
        method: "POST",
        body: JSON.stringify({ studentId: student?.studentId, reason }), // Ensure studentId is passed correctly
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Patient registered successfully!");
        // Refresh visits after registering a new one
        if (student?.studentId) {
          await fetchPreviousVisits(student.studentId);
        }
        // Optionally clear the form fields
        setStudentId("")
        setStudent(null)
        setReason("");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchStudent();
    }
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Search */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  <span>Student Search</span>
                </CardTitle>
                <CardDescription>
                  Enter student ID to search for patient records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., R/0001/18"
                      className="flex-1"
                    />
                    <Button
                      onClick={fetchStudent}
                      disabled={isSearching}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Student Information & Visit Registration */}
          <div className="lg:col-span-2 space-y-8">
            {" "}
            {/* Added space-y-8 for spacing between cards */}
            {student ? (
              <>
                {/* Patient Information Card */}
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserPlus className="w-5 h-5 text-emerald-500" />
                      <span>Patient Information</span>
                    </CardTitle>
                    <CardDescription>
                      Review patient details and register visit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Student Profile */}
                    <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className="flex-shrink-0">
                        {student.profileImageUrl ? (
                          <img
                            src={student.profileImageUrl || "/placeholder.svg"}
                            alt="Student photo"
                            className="rounded-lg object-cover border-2 border-white shadow-lg w-20 h-24"
                          />
                        ) : (
                          <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center border-2 border-white shadow-lg">
                            <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {student.fullName}
                          </h3>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            ID: {student.studentId}
                          </p>{" "}
                          {/* Use student.studentId */}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <User className="w-3 h-3" />
                            <span>{student.gender}</span>
                          </Badge>
                          {student.age && ( // Check if age exists
                            <Badge
                              variant="secondary"
                              className="flex items-center space-x-1"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>{student.age} years</span>
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          {student.college && ( // Check if college exists
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                              <GraduationCap className="w-4 h-4" />
                              <span>{student.college}</span>
                            </div>
                          )}
                          {student.department && ( // Check if department exists
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                              <MapPin className="w-4 h-4" />
                              <span>{student.department}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator />
                    {/* Previous Visits Card */}
                    {/* Previous Visits Card - Improved */}
                    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span>Previous Visits</span>
                          {previousVisits.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {previousVisits.length}{" "}
                              {previousVisits.length === 1 ? "Visit" : "Visits"}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          History of visits for this patient
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingVisits ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="ml-3 text-gray-500 dark:text-gray-400">
                              Loading visit history...
                            </span>
                          </div>
                        ) : previousVisits.length > 0 ? (
                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {" "}
                            {/* Increased height and custom scrollbar */}
                            {previousVisits.map((visit) => {
                              return (
                                <div
                                  key={visit.id}
                                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                      {" "}
                                      {/* min-w-0 helps with text truncation */}
                                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {visit.doctorNote?.diagnosis ||
                                          "No diagnosis provided"}
                                      </h4>
                                      <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 mt-1 gap-x-3 gap-y-1">
                                        <div className="flex items-center">
                                          <CalendarDays className="w-3 h-3 mr-1 flex-shrink-0" />
                                          <span>
                                            {formatDate(visit.createdAt)}
                                          </span>
                                        </div>
                                        {visit.assignedDoctor && (
                                          <div className="flex items-center">
                                            <Stethoscope className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                              Dr. {visit.assignedDoctor.name}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Summary of Notes/Results - Optional Enhancement */}
                                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex flex-wrap gap-2 text-xs">
                                    {visit.nurseNote && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge
                                              variant="outline"
                                              className="flex items-center cursor-help"
                                            >
                                              <Heart className="w-3 h-3 mr-1" />
                                              <span>Nurse Note</span>
                                              {visit.nurseNote.notes && (
                                                <span className="ml-1">•</span>
                                              )}
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent
                                            side="bottom"
                                            className="max-w-xs p-3 bg-gray-800 text-white text-xs rounded-md"
                                          >
                                            <p>
                                              <span className="font-medium">
                                                Nurse Notes:
                                              </span>
                                            </p>
                                            <p className="mt-1">
                                              {visit.nurseNote.notes ||
                                                "Notes exist but are empty."}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    {visit.doctorNote && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge
                                              variant="outline"
                                              className="flex items-center cursor-help"
                                            >
                                              <Stethoscope className="w-3 h-3 mr-1" />
                                              <span>Diagnosis</span>
                                              {visit.doctorNote.diagnosis && (
                                                <span className="ml-1">•</span>
                                              )}
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
                                              {visit.doctorNote.diagnosis ||
                                                "Diagnosis recorded but empty."}
                                            </p>
                                            {visit.doctorNote.prescription && (
                                              <>
                                                <p className="mt-2 font-medium">
                                                  Prescription:
                                                </p>
                                                <p className="mt-1 whitespace-pre-wrap">
                                                  {
                                                    visit.doctorNote
                                                      .prescription
                                                  }
                                                </p>
                                              </>
                                            )}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    {visit.labResult && (
                                      <Badge
                                        variant="outline"
                                        className="flex items-center"
                                      >
                                        <Beaker className="w-3 h-3 mr-1" />{" "}
                                        {/* Assuming Beaker icon is imported */}
                                        <span>Lab Result</span>
                                      </Badge>
                                    )}
                                    {visit.pharmacyNote && (
                                      <Badge
                                        variant="outline"
                                        className="flex items-center"
                                      >
                                        <Pill className="w-3 h-3 mr-1" />{" "}
                                        {/* Assuming Pill icon is imported */}
                                        <span>Pharmacy</span>
                                      </Badge>
                                    )}
                                    {/* Add badges for other note types if included */}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                              <FileText className="w-10 h-10 opacity-70 text-blue-500 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                              No Visit History
                            </h3>
                            <p className="mt-1 max-w-md">
                              This patient does not have any previous visits
                              recorded in the system.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {/* Visit Registration */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Visit</Label>
                        <Textarea
                          id="reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Describe the reason for this visit (symptoms, concerns, routine check-up, etc.)"
                          className="min-h-[100px] resize-none"
                        />
                      </div>
                      <Button
                        onClick={registerVisit}
                        disabled={isRegistering}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-lg font-medium"
                      >
                        {isRegistering ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Registering Visit...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <UserPlus className="w-5 h-5" />
                            <span>Register Visit</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Student Selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Search for a student using their ID to view their
                    information and register a visit.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
