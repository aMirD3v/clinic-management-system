// app/visits/[id]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma'; // Adjust path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Import types
import type { Visit, StudentInfo, User, NurseNote, DoctorNote, LabResult, PharmacyNote, Stock } from '@prisma/client';
import { LabResultsTable } from '@/components/lab-results-table';

// --- CORRECT the type definition to match the schema ---
// Visit has pharmacyNote (singular, optional)
type FullVisit = Visit & {
  studentInfo: StudentInfo | null;
  assignedDoctor: User | null;
  nurseNote: NurseNote | null;
  doctorNote: DoctorNote | null;
  labResult: LabResult | null;
  // --- pharmacyNote is singular and optional ---
  pharmacyNote: (PharmacyNote & { stock: Stock | null }) | null; // Include Stock info
};

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // --- Fetch the visit with ALL related data ---
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        studentInfo: true,
        assignedDoctor: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        nurseNote: true,
        doctorNote: true,
        labResult: true,
        // --- CORRECT the field name here ---
        pharmacyNote: {
          include: {
            stock: {
              select: {
                id: true,
                medicineName: true,
                description: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    if (!visit) {
      console.warn(`Visit with ID ${id} not found.`);
      notFound();
    }

    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Visit Details</h1>
            <p className="text-sm text-muted-foreground">ID: {visit.id}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        {/* --- 1. Visit Summary Card --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center justify-between gap-2">
              <span>Visit Summary</span>
              <Badge
                className={
                  visit.status === 'WAITING_FOR_NURSE' ? 'bg-yellow-500' :
                  visit.status === 'READY_FOR_DOCTOR' ? 'bg-blue-500' :
                  visit.status === 'SENT_TO_LAB' ? 'bg-purple-500' :
                  visit.status === 'LAB_RESULTS_READY' ? 'bg-indigo-500' :
                  visit.status === 'READY_FOR_PHARMACY' ? 'bg-green-500' :
                  visit.status === 'COMPLETED' ? 'bg-gray-500' :
                  'bg-gray-500'
                }
              >
                {visit.status.replace(/_/g, ' ')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <DetailItem label="Visit ID" value={visit.id} /> */}
              <DetailItem label="Created At" value={visit.createdAt.toLocaleString()} />
              <DetailItem label="Last Updated" value={visit.updatedAt.toLocaleString()} />
              <DetailItem label="Reason for Visit" value={visit.reason} />
              <DetailItem label="Assigned Doctor" value={visit.assignedDoctor?.name || 'Unassigned'} />
              {/* <DetailItem label="Doctor Role" value={visit.assignedDoctor?.role || 'N/A'} /> */}
            </div>
          </CardContent>
        </Card>

        {/* --- 2. Student Information Card --- */}
        {visit.studentInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {visit.studentInfo.profileImageUrl && (
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                  <img
                    src={visit.studentInfo.profileImageUrl}
                    alt={`Profile picture of ${visit.studentInfo.fullName}`}
                    style={{ objectFit: 'cover' }} className="rounded"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Full Name" value={visit.studentInfo.fullName} />
              <DetailItem label="Student ID" value={visit.studentInfo.studentId} />
              <DetailItem label="Gender" value={visit.studentInfo.gender} />
              <DetailItem label="Age" value={visit.studentInfo.age?.toString() || 'N/A'} />
              <DetailItem label="Email" value={visit.studentInfo.email || 'N/A'} />
              <DetailItem label="Phone" value={visit.studentInfo.phone || 'N/A'} />
              <DetailItem label="College" value={visit.studentInfo.college || 'N/A'} />
              <DetailItem label="Department" value={visit.studentInfo.department || 'N/A'} />
            </div>
          </CardContent>
        </Card>
        )}

        {/* --- 3. Nurse Note Card --- */}
        {visit.nurseNote && (
          <Card>
            <CardHeader>
              <CardTitle>Nurse Note</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <DetailItem label="Blood Pressure" value={visit.nurseNote.bloodPressure} />
                <DetailItem label="Temperature" value={visit.nurseNote.temperature} />
                <DetailItem label="Pulse" value={visit.nurseNote.pulse} />
                <DetailItem label="Weight" value={visit.nurseNote.weight} />
              </div>
              {visit.nurseNote.notes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {visit.nurseNote.notes}
                  </dd>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* --- 4. Doctor Note Card --- */}
        {visit.doctorNote && (
          <Card>
            <CardHeader>
              <CardTitle>Doctor Note</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <DetailItem label="Diagnosis" value={visit.doctorNote.diagnosis} />
              {visit.doctorNote.prescription && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Prescription</dt>
                  <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                    {visit.doctorNote.prescription}
                  </dd>
                </div>
              )}
              {/* <DetailItem label="Lab Test Requested" value={visit.doctorNote.requestLabTest ? 'Yes' : 'No'} /> */}
              
              {/* {visit.doctorNote.labTests && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Requested Tests</dt>
                  <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    <pre className="overflow-auto max-h-40 text-xs">
                      {JSON.stringify(visit.doctorNote.labTests, null, 2)}
                    </pre>
                  </dd>
                </div>
              )} */}
              {visit.doctorNote.notes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {visit.doctorNote.notes}
                  </dd>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* --- 5. Lab Result Card --- */}
{visit.labResult && (
  <Card>
    <CardHeader>
      <CardTitle>Lab Result</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4">
      <div>
        <dt className="text-sm font-medium text-gray-500 sr-only">Results Table</dt> {/* Hidden label for accessibility */}
        <dd className="mt-1 text-sm text-gray-900">
          {/* Parse and display results in a table */}
          <LabResultsTable resultsJson={visit.labResult.results} />
        </dd>
      </div>
      {visit.labResult.notes && (
        <div>
          <dt className="text-sm font-medium text-gray-500">Notes</dt>
          <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
            {visit.labResult.notes}
          </dd>
        </div>
      )}
    </CardContent>
  </Card>
)}

        {/* --- 6. Pharmacy Note Card (Singular) --- */}
        {/* Updated to use visit.pharmacyNote (singular) */}
        {visit.pharmacyNote && (
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Note</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label="Medicine"
                  value={visit.pharmacyNote.stock?.medicineName || `Stock ID: ${visit.pharmacyNote.stockId}`}
                />
                <DetailItem label="Description" value={visit.pharmacyNote.stock?.description || 'N/A'} />
                <DetailItem label="Dispensed Quantity" value={`${visit.pharmacyNote.quantity} ${visit.pharmacyNote.stock?.unit || ''}`} />
                <DetailItem label="Unit" value={visit.pharmacyNote.stock?.unit || 'N/A'} />
                {visit.pharmacyNote.notes && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {visit.pharmacyNote.notes}
                    </dd>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    );
  } catch (error) {
    console.error("Error fetching visit details:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>Failed to load visit details. Please try again later.</p>
        <Button asChild className="mt-4">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
}

// --- Helper component (remains the same) ---
function DetailItem({ label, value, children }: { label: string; value?: string | React.ReactNode; children?: React.ReactNode }) {
  if ((value === undefined || value === null || value === '') && !children) {
    return null;
  }

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value ?? children ?? 'N/A'}
      </dd>
    </div>
  );
}