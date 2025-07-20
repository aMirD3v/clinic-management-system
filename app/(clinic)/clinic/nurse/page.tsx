"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
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
  Stethoscope,
  Heart,
  Thermometer,
  Activity,
  Weight,
  Clock,
  User,
  FileText,
  ArrowLeft,
  Send,
  LogOut,
  Users,
  ClipboardList,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import toast from "react-hot-toast"

interface Visit {
  id: string
  studentId: string
  reason: string
  createdAt: string
  assignedDoctor?: {
    name: string
  }
  student?: {
    fullName: string
    profileImageUrl?: string
  }
}

interface VitalForm {
  bloodPressure: string
  temperature: string
  pulse: string
  weight: string
  notes: string
}

export default function NurseDashboard() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [form, setForm] = useState<VitalForm>({
    bloodPressure: "",
    temperature: "",
    pulse: "",
    weight: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/clinic/nurse/visits/")
      if (res.ok) {
        let data: Visit[] = await res.json()
        // Find visits missing student info
        const visitsToFetch = data.filter(
          v => !v.student || !v.student.fullName || !v.student.profileImageUrl
        )
        // Fetch missing student info in parallel
        const studentFetches = visitsToFetch.map(async (visit) => {
          try {
            const sRes = await fetch(`/api/students/${visit.studentId}`)
            if (sRes.ok) {
              const sData = await sRes.json()
              visit.student = {
                fullName: sData.fullName,
                profileImageUrl: sData.profileImageUrl || undefined,
              }
            }
          } catch (e) {
            // ignore error, leave as is
          }
        })
        await Promise.all(studentFetches)
        setVisits(data)
      } else {
        toast.error("Failed to load visits")
      }
    } catch (error) {
      toast.error("Failed to load visits")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.bloodPressure || !form.temperature || !form.pulse || !form.weight) {
      toast.error("Please fill in all vital signs")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/clinic/nurse/submit/${selectedVisit?.id}/nurse-note`, {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        toast.success("Vitals recorded successfully!")
        setSelectedVisit(null)
        setForm({ bloodPressure: "", temperature: "", pulse: "", weight: "", notes: "" })
        fetchVisits()
      } else {
        toast.error("Failed to record vitals")
      }
    } catch (error) {
      toast.error("Failed to record vitals")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedVisit(null)
    setForm({ bloodPressure: "", temperature: "", pulse: "", weight: "", notes: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        {!selectedVisit ? (
          /* Visits List */
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-sky-500" />
                <span>Pending Vital Signs</span>
              </CardTitle>
              <CardDescription>Select a patient to record their vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : visits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Pending Visits</h3>
                  <p className="text-gray-500 dark:text-gray-400">All patients have completed their vital signs.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {visits.map((visit) => (
                    <Card
                      key={visit.id}
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-sky-500 bg-white dark:bg-gray-900"
                      onClick={() => setSelectedVisit(visit)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-sky-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {visit.student?.fullName || `Student ${visit.studentId}`}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">ID: {visit.studentId}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{visit.reason}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(visit.createdAt), "MMM dd, HH:mm")}
                              </span>
                            </div>
                            {visit.assignedDoctor && (
                              <Badge variant="secondary" className="text-xs">
                                Dr. {visit.assignedDoctor.name}
                              </Badge>
                            )}
                            <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                              <Stethoscope className="w-4 h-4 mr-2" />
                              Record Vitals
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
          /* Vitals Recording Form */
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="w-5 h-5 text-sky-500" />
                    <span>Record Vital Signs</span>
                  </CardTitle>
                  <CardDescription>
                    Patient: {selectedVisit.student?.fullName || selectedVisit.studentId}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to List</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Info */}
              <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg border border-sky-100 dark:border-sky-800">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedVisit.student?.fullName || `Student ${selectedVisit.studentId}`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Reason: {selectedVisit.reason}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Arrived: {format(new Date(selectedVisit.createdAt), "PPpp")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vitals Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure" className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Blood Pressure</span>
                  </Label>
                  <Input
                    id="bloodPressure"
                    placeholder="e.g., 120/80 mmHg"
                    value={form.bloodPressure}
                    onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span>Temperature</span>
                  </Label>
                  <Input
                    id="temperature"
                    placeholder="e.g., 36.5°C"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pulse" className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>Pulse Rate</span>
                  </Label>
                  <Input
                    id="pulse"
                    placeholder="e.g., 72 bpm"
                    value={form.pulse}
                    onChange={(e) => setForm({ ...form, pulse: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center space-x-2">
                    <Weight className="w-4 h-4 text-purple-500" />
                    <span>Weight</span>
                  </Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 70 kg"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Additional Notes</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations or notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !form.bloodPressure || !form.temperature || !form.pulse || !form.weight}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white h-12 text-lg font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Save & Send to Doctor</span>
                    </div>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="px-8 h-12 bg-transparent">
                  Cancel
                </Button>
              </div>

              {/* Required Fields Notice */}
              <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  All vital signs are required before sending to the doctor.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
