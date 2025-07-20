"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { signOut } from "next-auth/react"
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
} from "lucide-react"
import toast from "react-hot-toast"

interface Visit {
  id: string
  studentId: string
  reason: string
  createdAt: string
}

interface Student {
  studentId: string
  fullName: string
  gender: string
  age: number | null
  email: string
  phone: string
  college: string
  department: string
  profileImageUrl: string | null
}

export default function LabPanel() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [result, setResult] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingStudent, setFetchingStudent] = useState(false)

  useEffect(() => {
    fetchVisits()
  }, [])

  useEffect(() => {
    if (selectedVisit) {
      fetchStudent(selectedVisit.studentId)
    }
  }, [selectedVisit])

  const fetchVisits = async () => {
    try {
      const res = await fetch("/api/clinic/laboratory/visits")
      if (res.ok) {
        const data = await res.json()
        setVisits(data)
      } else {
        toast.error("Failed to load lab requests")
      }
    } catch (error) {
      toast.error("Failed to load lab requests")
    }
  }

  const fetchStudent = async (studentId: string) => {
    setFetchingStudent(true)
    try {
      const res = await fetch(`/api/students/${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setStudent(data)
      } else {
        toast.error("Failed to load student information")
      }
    } catch (error) {
      toast.error("Failed to load student information")
    } finally {
      setFetchingStudent(false)
    }
  }

  const submitLabResult = async () => {
    if (!result.trim()) {
      toast.error("Lab result is required")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/clinic/laboratory/submit/${selectedVisit?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, notes }),
      })

      if (res.ok) {
        toast.success("Lab result submitted successfully!")
        setVisits((prev) => prev.filter((v) => v.id !== selectedVisit?.id))
        setSelectedVisit(null)
        setStudent(null)
        setResult("")
        setNotes("")
      } else {
        toast.error("Failed to submit lab result")
      }
    } catch (error) {
      toast.error("Failed to submit lab result")
    } finally {
      setLoading(false)
    }
  }

  const handleVisitSelect = (visit: Visit) => {
    setSelectedVisit(visit)
    setResult("")
    setNotes("")
  }

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
              <CardDescription>Select a lab request to process and submit results</CardDescription>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TestTube className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Pending Tests</h3>
                  <p className="text-gray-500 dark:text-gray-400">All lab requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visits.map((visit) => (
                    <Card
                      key={visit.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${
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
                              <p className="font-medium text-gray-900 dark:text-white">Student ID Number: {visit.studentId}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Test: {visit.reason}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(visit.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(visit.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lab Result Form */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            {selectedVisit && student ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Microscope className="w-5 h-5 text-purple-500" />
                    <span>Submit Lab Results</span>
                  </CardTitle>
                  <CardDescription>Process and submit laboratory test results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {fetchingStudent ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      {/* Patient Information */}
                      <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {student.profileImageUrl ? (
                              <img
                                src={student.profileImageUrl || "/placeholder.svg"}
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
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{student.fullName}</h3>
                              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                ID: {student.studentId}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <User className="w-4 h-4" />
                                <span>{student.gender}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Calendar className="w-4 h-4" />
                                <span>{student.age} years</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Phone className="w-4 h-4" />
                                <span>{student.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Mail className="w-4 h-4" />
                                <span>{student.email}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <GraduationCap className="w-4 h-4" />
                                <span>{student.college}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4" />
                                <span>{student.department}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            <strong>Requested Test:</strong> {selectedVisit.reason}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Lab Result Form */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="result" className="flex items-center space-x-2">
                            <TestTube className="w-4 h-4 text-purple-500" />
                            <span>Lab Result *</span>
                          </Label>
                          <Textarea
                            id="result"
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            placeholder="Enter detailed lab test results, measurements, observations..."
                            className="min-h-[120px] resize-none"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes" className="flex items-center space-x-2">
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
                            Please ensure all test results are accurate before submission. Results will be sent directly
                            to the attending physician.
                          </p>
                        </div>

                        <Button
                          onClick={submitLabResult}
                          disabled={loading || !result.trim()}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white h-12 text-lg font-medium"
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
                    </>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Microscope className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Test Selected</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Select a pending lab request from the list to process and submit results.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
