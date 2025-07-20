"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { signOut } from "next-auth/react"
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
} from "lucide-react"
import toast from "react-hot-toast"

export default function ReceptionPage() {
  const [studentId, setStudentId] = useState("")
  const [student, setStudent] = useState<any | null>(null)
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const fetchStudent = async () => {
    if (!studentId.trim()) {
      toast.error("Please enter a student ID")
      return
    }

    setError("")
    setStudent(null)
    setIsSearching(true)

    try {
      const encodedStudentId = encodeURIComponent(studentId)
      const res = await fetch(`/api/students/${encodedStudentId}`)
      if (res.ok) {
        const data = await res.json()
        setStudent(data)
        toast.success("Student found!")
      } else {
        const { error } = await res.json()
        setError(error)
        toast.error(error || "Student not found")
      }
    } catch (err) {
      setError("Failed to search student")
      toast.error("Failed to search student")
    } finally {
      setIsSearching(false)
    }
  }

  const registerVisit = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason for the visit")
      return
    }

    setIsRegistering(true)
    try {
      const res = await fetch("/api/clinic/reception/visits", {
        method: "POST",
        body: JSON.stringify({ studentId, reason }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        toast.success("Patient registered successfully!")
        setStudentId("")
        setStudent(null)
        setReason("")
      } else {
        toast.error("Registration failed")
      }
    } catch (err) {
      toast.error("Registration failed")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchStudent()
    }
  }

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
                <CardDescription>Enter student ID to search for patient records</CardDescription>
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
                      placeholder="e.g., JU/2024/001"
                      className="flex-1"
                    />
                    <Button onClick={fetchStudent} disabled={isSearching} className="bg-blue-500 hover:bg-blue-600">
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
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Student Information & Visit Registration */}
          <div className="lg:col-span-2">
            {student ? (
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-emerald-500" />
                    <span>Patient Information</span>
                  </CardTitle>
                  <CardDescription>Review patient details and register visit</CardDescription>
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{student.fullName}</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">ID: {studentId}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{student.gender}</span>
                        </Badge>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{student.age} years</span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
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

                  <Separator />

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
                      disabled={isRegistering || !reason.trim()}
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
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Student Selected</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Search for a student using their ID to view their information and register a visit.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
