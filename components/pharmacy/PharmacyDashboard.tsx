"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOut } from "next-auth/react";
import {
  Pill,
  Package,
  ShoppingCart,
  User,
  Clock,
  FileText,
  Plus,
  Minus,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Search,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

type Visit = {
  id: string;
  studentId: string;
  reason: string;
  createdAt: string;
  studentInfo: {
    fullName: string;
    studentId: string;
    profileImageUrl?: string;
    gender?: string;
    age?: number;
    phone?: string;
    email?: string;
    college?: string;
    department?: string;
  } | null;
  doctorNote: {
    prescription: string | null;
  } | null;
};

type Stock = {
  id: string;
  medicineName: string;
  quantity: number;
};

interface PharmacyDashboardProps {
  visits: Visit[];
  stocks: Stock[];
}

export default function PharmacyDashboard({
  visits: initialVisits,
  stocks,
}: PharmacyDashboardProps) {
  const [visits, setVisits] = useState(initialVisits);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState<
    { name: string; quantity: number }[]
  >([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDispensing, setIsDispensing] = useState(false);

  const filteredVisits = visits.filter((visit) => {
    const query = searchQuery.toLowerCase();
    return (
      visit.studentInfo?.fullName?.toLowerCase().includes(query) ||
      visit.studentInfo?.studentId?.toLowerCase().includes(query) ||
      visit.reason.toLowerCase().includes(query)
    );
  });

  const handleAddMedicine = () => {
    if (!selectedMedicine) {
      toast.error("Please select a medicine");
      return;
    }

    const existingIndex = medicines.findIndex(
      (m) => m.name === selectedMedicine
    );
    if (existingIndex >= 0) {
      const updated = [...medicines];
      updated[existingIndex].quantity += quantity;
      setMedicines(updated);
    } else {
      setMedicines([...medicines, { name: selectedMedicine, quantity }]);
    }

    setSelectedMedicine("");
    setQuantity(1);
    toast.success("Medicine added to dispense list");
  };

  const handleRemoveMedicine = (index: number) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
    toast.success("Medicine removed from list");
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveMedicine(index);
      return;
    }

    const updated = [...medicines];
    updated[index].quantity = newQuantity;
    setMedicines(updated);
  };

  const handleDispense = async () => {
    if (!selectedVisit) return;
    if (medicines.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }

    setIsDispensing(true);
    try {
      const res = await fetch("/api/clinic/pharmacy/dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitId: selectedVisit.id,
          medicines: medicines.map((m) => ({
            name: m.name,
            quantity: m.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Dispensing failed");
      }

      toast.success("Medicines dispensed successfully!");
      setVisits((prev) => prev.filter((v) => v.id !== selectedVisit.id));
      setSelectedVisit(null);
      setMedicines([]);
    } catch (error) {
      toast.error("Failed to dispense medicines");
    } finally {
      setIsDispensing(false);
    }
  };

  const handleBackToList = () => {
    setSelectedVisit(null);
    setMedicines([]);
    setSelectedMedicine("");
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedVisit ? (
          /* Prescription List View */
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-500" />
                    <span>Pending Prescriptions</span>
                  </CardTitle>
                  <CardDescription>
                    Select a prescription to dispense medicines
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search prescriptions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredVisits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    {searchQuery ? (
                      <Search className="w-8 h-8 text-gray-400" />
                    ) : (
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {searchQuery
                      ? "No Prescriptions Found"
                      : "No Pending Prescriptions"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? `No prescriptions match "${searchQuery}". Try a different search term.`
                      : "All prescriptions have been processed. New prescriptions will appear here."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredVisits.map((visit) => (
                    <Card
                      key={visit.id}
                      className="hover:shadow-lg bg-green-100/20 dark:bg-gray-900 transition-all duration-200 cursor-pointer border-l-4 border-l-emerald-500"
                      onClick={() => setSelectedVisit(visit)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {visit.studentInfo?.profileImageUrl ? (
                                <img
                                  src={
                                    visit.studentInfo.profileImageUrl ||
                                    "/placeholder.svg"
                                  }
                                  alt="Patient photo"
                                  className="rounded-lg object-cover border-2 border-white shadow-lg w-20 h-24"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-emerald-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {visit.studentInfo?.fullName ||
                                  "Unknown Patient"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                ID:{" "}
                                {visit.studentInfo?.studentId ||
                                  visit.studentId}
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
                                {new Date(visit.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {visit.doctorNote?.prescription && (
                              <Badge variant="secondary" className="text-xs">
                                Prescription Available
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              <Pill className="w-4 h-4 mr-2" />
                              Dispense
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
          /* Medicine Dispensing View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Information */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-emerald-500" />
                    <span>Patient Information</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleBackToList}
                    className="bg-transparent"
                  >
                    ← Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient Profile */}
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <div className="flex-shrink-0">
                    {selectedVisit.studentInfo?.profileImageUrl ? (
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
                        {selectedVisit.studentInfo?.fullName ||
                          "Unknown Patient"}
                      </h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        ID:{" "}
                        {selectedVisit.studentInfo?.studentId ||
                          selectedVisit.studentId}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                      <div className="space-y-1">
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
                  </div>
                </div>

                {/* Prescription */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="flex items-center space-x-2 font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Doctor's Prescription</span>
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedVisit.doctorNote?.prescription ||
                      "No prescription provided"}
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    <strong>Reason for Visit:</strong> {selectedVisit.reason}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medicine Dispensing */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-emerald-500" />
                  <span>Dispense Medicines</span>
                </CardTitle>
                <CardDescription>
                  Add medicines to dispense to the patient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Medicine Form */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="medicine">Select Medicine</Label>
                        <Select
                          value={selectedMedicine}
                          onValueChange={setSelectedMedicine}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose medicine..." />
                          </SelectTrigger>
                          <SelectContent>
                            {stocks.filter((stock) => stock.quantity > 0)
                              .length === 0 ? (
                              <div className="text-sm text-gray-500 p-2">
                                No medicine available
                              </div>
                            ) : (
                              stocks
                                .filter((stock) => stock.quantity > 0)
                                .map((stock) => (
                                  <SelectItem
                                    key={stock.id}
                                    value={stock.medicineName}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{stock.medicineName}</span>
                                      <Badge
                                        variant={
                                          stock.quantity < 10
                                            ? "destructive"
                                            : "secondary"
                                        }
                                        className="ml-2"
                                      >
                                        {stock.quantity} left
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(Number.parseInt(e.target.value) || 1)
                          }
                          className="h-10"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddMedicine}
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medicine
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Medicine List */}
                {medicines.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Medicines to Dispense
                    </h4>
                    <div className="space-y-3">
                      {medicines.map((medicine, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Pill className="w-4 h-4 text-emerald-600" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {medicine.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateQuantity(
                                  index,
                                  medicine.quantity - 1
                                )
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {medicine.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateQuantity(
                                  index,
                                  medicine.quantity + 1
                                )
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveMedicine(index)}
                              className="ml-2"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No medicines added yet
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleDispense}
                  disabled={isDispensing || medicines.length === 0}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-lg font-medium"
                >
                  {isDispensing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Dispensing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Dispense Medicines ({medicines.length})</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
