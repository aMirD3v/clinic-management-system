// app/(clinic)/clinic/laboratory/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Microscope,
  TestTube,
  FlaskConical,
  User,
  Clock,
  Send,
  LogOut,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

interface Visit {
  id: string;
  studentId: string;
  reason: string;
  createdAt: string;
  doctorNote?: {
    labTests: Array<{
      category: string;
      tests: string[];
    }>;
  };
  studentInfo: {
    studentId: string;
    fullName: string;
    gender: string;
    age: number | null;
    email: string;
    phone: string;
    college: string;
    department: string;
    profileImageUrl: string | null;
  };
}

interface TestResult {
  testName: string;
  result: string;
  normalRange: string;
}

interface CategoryResults {
  [category: string]: TestResult[];
}

export default function LabPanel() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryResults, setCategoryResults] = useState<CategoryResults>({});
  const [allTestsCompleted, setAllTestsCompleted] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await fetch("/api/clinic/laboratory/visits");
      if (res.ok) {
        const data = await res.json();
        setVisits(data);
      } else {
        toast.error("Failed to load lab requests");
      }
    } catch (error) {
      toast.error("Failed to load lab requests");
    }
  };

  useEffect(() => {
    if (selectedVisit && selectedVisit.doctorNote?.labTests) {
      // Initialize results for each test
      const initialResults: CategoryResults = {};
      
      selectedVisit.doctorNote.labTests.forEach(category => {
        initialResults[category.category] = category.tests.map(test => ({
          testName: test,
          result: "",
          normalRange: ""
        }));
      });
      
      setCategoryResults(initialResults);
      setNotes("");
    }
  }, [selectedVisit]);

  useEffect(() => {
    // Check if all tests have results
    if (selectedVisit && selectedVisit.doctorNote?.labTests) {
      const allFilled = Object.values(categoryResults).every(category => 
        category.every(test => test.result.trim() !== "")
      );
      setAllTestsCompleted(allFilled);
    }
  }, [categoryResults, selectedVisit]);

  const submitLabResult = async () => {
    if (!allTestsCompleted) {
      toast.error("Please complete all test results before submitting");
      return;
    }

    setLoading(true);
    try {
      const results = Object.entries(categoryResults).flatMap(
        ([category, tests]) => 
          tests.map(test => ({
            category,
            testName: test.testName,
            result: test.result,
            normalRange: test.normalRange
          }))
      );

      const res = await fetch(
        `/api/clinic/laboratory/submit/${selectedVisit?.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ results, notes }),
        }
      );

      if (res.ok) {
        toast.success("Lab result submitted successfully!");
        setVisits((prev) => prev.filter((v) => v.id !== selectedVisit?.id));
        setSelectedVisit(null);
        setCategoryResults({});
        setNotes("");
      } else {
        toast.error("Failed to submit lab result");
      }
    } catch (error) {
      toast.error("Failed to submit lab result");
    } finally {
      setLoading(false);
    }
  };

  const handleVisitSelect = (visit: Visit) => {
    setSelectedVisit(visit);
    setCategoryResults({});
    setNotes("");
  };

  const handleTestResultChange = (
    category: string,
    testIndex: number,
    field: "result" | "normalRange",
    value: string
  ) => {
    setCategoryResults(prev => {
      const updatedCategory = [...prev[category]];
      updatedCategory[testIndex] = {
        ...updatedCategory[testIndex],
        [field]: value
      };
      
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lab Requests List */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="w-5 h-5 text-purple-500" />
                <span>Pending Lab Requests</span>
              </CardTitle>
              <CardDescription>
                Select a lab request to process and submit results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TestTube className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Pending Tests
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    All lab requests have been processed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visits.map((visit) => (
                    <Card
                      key={visit.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 bg-white/60 dark:bg-gray-900/80 backdrop-blur-sm ${
                        selectedVisit?.id === visit.id
                          ? "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-l-gray-200 hover:border-l-purple-300"
                      }`}
                      onClick={() => handleVisitSelect(visit)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                              <FlaskConical className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {visit?.studentInfo?.fullName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                ID: {visit.studentId}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Test: {visit.reason}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(visit.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(visit.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        
                        {visit.doctorNote?.labTests && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                              Requested Tests:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {visit.doctorNote.labTests.flatMap(category => 
                                category.tests
                              ).slice(0, 3).map(test => (
                                <span 
                                  key={test} 
                                  className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded"
                                >
                                  {test}
                                </span>
                              ))}
                              {visit.doctorNote.labTests.flatMap(category => 
                                category.tests
                              ).length > 3 && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">
                                  +{visit.doctorNote.labTests.flatMap(category => 
                                    category.tests
                                  ).length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lab Result Form */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            {selectedVisit && selectedVisit.studentInfo ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Microscope className="w-5 h-5 text-purple-500" />
                    <span>Submit Lab Results</span>
                  </CardTitle>
                  <CardDescription>
                    Process and submit laboratory test results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      {/* Patient Information */}
                      <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {selectedVisit.studentInfo.profileImageUrl ? (
                              <img
                                src={
                                  selectedVisit.studentInfo.profileImageUrl ||
                                  "/placeholder.svg"
                                }
                                alt="Patient photo"
                                className="rounded-lg object-cover border-2 border-white shadow-lg w-20 h-24"
                              />
                            ) : (
                              <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center border-2 border-white shadow-lg">
                                <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {selectedVisit.studentInfo.fullName}
                              </h3>
                              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                ID: {selectedVisit.studentInfo.studentId}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <User className="w-4 h-4" />
                                <span>{selectedVisit.studentInfo.gender}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {selectedVisit.studentInfo.age} years
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Phone className="w-4 h-4" />
                                <span>{selectedVisit.studentInfo.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Mail className="w-4 h-4" />
                                <span>{selectedVisit.studentInfo.email}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <GraduationCap className="w-4 h-4" />
                                <span>{selectedVisit.studentInfo.college}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {selectedVisit.studentInfo.department}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            <strong>Requested Test:</strong>{" "}
                            {selectedVisit.reason}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Lab Test Forms */}
                      <div className="space-y-8">
                        {selectedVisit.doctorNote?.labTests?.map((category) => (
                          <div key={category.category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                              {category.category}
                            </h3>
                            
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-50 dark:bg-gray-800">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                      Test
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                      Result
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                      Normal Range
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {categoryResults[category.category]?.map((testResult, testIndex) => (
                                    <tr key={`${category.category}-${testResult.testName}`}>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {testResult.testName}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <Input
                                          value={testResult.result}
                                          onChange={(e) => 
                                            handleTestResultChange(
                                              category.category, 
                                              testIndex, 
                                              "result", 
                                              e.target.value
                                            )
                                          }
                                          placeholder="Enter result"
                                          className="w-full"
                                        />
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <Input
                                          value={testResult.normalRange}
                                          onChange={(e) => 
                                            handleTestResultChange(
                                              category.category, 
                                              testIndex, 
                                              "normalRange", 
                                              e.target.value
                                            )
                                          }
                                          placeholder="Normal range"
                                          className="w-full"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="notes"
                              className="flex items-center space-x-2"
                            >
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span>Additional Notes</span>
                            </Label>
                            <Textarea
                              id="notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Any additional observations, recommendations, or technical notes..."
                              className="min-h-[80px] resize-none"
                            />
                          </div>

                          <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-blue-500" />
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              Please ensure all test results are accurate before
                              submission. Results will be sent directly to the
                              attending physician.
                            </p>
                          </div>

                          <Button
                            onClick={submitLabResult}
                            disabled={loading || !allTestsCompleted}
                            className={`w-full h-12 text-lg font-medium ${
                              allTestsCompleted 
                                ? "bg-purple-500 hover:bg-purple-600 text-white"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {loading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Submitting Results...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Send className="w-5 h-5" />
                                <span>Submit Lab Results</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Microscope className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Test Selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Select a pending lab request from the list to process and
                  submit results.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}