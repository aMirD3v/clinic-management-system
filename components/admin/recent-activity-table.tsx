// components/admin/recent-activity-table.tsx
'use client'; // This component uses client-side features like useRouter

import { Visit, StudentInfo, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface ExtendedVisit extends Visit {
  studentInfo: Pick<StudentInfo, 'fullName' | 'studentId'> | null;
  assignedDoctor: Pick<User, 'name'> | null;
}

interface RecentActivityTableProps {
  visits: ExtendedVisit[];
}

export function RecentActivityTable({ visits }: RecentActivityTableProps) {
  const router = useRouter();

  const handleViewVisit = (visitId: string) => {
    router.push(`/admin/visits/${visitId}`); // Navigate to visit details page
  };

  if (visits.length === 0) {
    return <p className="text-muted-foreground">No recent visits found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Doctor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                {visit.studentInfo?.studentId || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {visit.studentInfo?.fullName || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {visit.reason}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${
                    visit.status === 'WAITING_FOR_NURSE' ? 'bg-yellow-100 text-yellow-800' :
                    visit.status === 'READY_FOR_DOCTOR' ? 'bg-blue-100 text-blue-800' :
                    visit.status === 'SENT_TO_LAB' ? 'bg-purple-100 text-purple-800' :
                    visit.status === 'LAB_RESULTS_READY' ? 'bg-indigo-100 text-indigo-800' :
                    visit.status === 'READY_FOR_PHARMACY' ? 'bg-green-100 text-green-800' :
                    visit.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800' // Default
                  }`}>
                  {visit.status.replace(/_/g, ' ')} {/* Format status for display */}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                 {visit.assignedDoctor?.name || 'Unassigned'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {visit.createdAt.toLocaleDateString()} {/* Format date as needed */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" size="sm" onClick={() => handleViewVisit(visit.id)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}