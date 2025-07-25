// components/lab-results-table.tsx
'use client';

import React, { useEffect, useState } from 'react';

// Define the type for a single test result object
interface LabTestResult {
  category: string;
  testName: string;
  result: string; // Adjust type if results can be numbers/booleans
  normalRange: string;
}

// --- Update Props Type ---
// Accept the broader JsonValue type that Prisma provides
// import type { JsonValue } from '@prisma/client/runtime/library'; // If needed, but often available globally
interface LabResultsTableProps {
  // Use JsonValue or the specific types it encompasses if known
  // Let's use JsonValue for maximum compatibility with Prisma's type
  resultsJson: unknown; // Or JsonValue if you import it. 'unknown' is safer initially.
}

export function LabResultsTable({ resultsJson }: LabResultsTableProps) {
  const [error, setError] = useState<string | null>(null);
  const [parsedResults, setParsedResults] = useState<LabTestResult[]>([]);

  useEffect(() => {
    try {
      setError(null); // Reset error on new data
      setParsedResults([]); // Reset results

      // --- Handle Prisma's JsonValue type correctly ---
      // 1. Check for null/undefined
      if (resultsJson === null || resultsJson === undefined) {
        // It's okay for results to be null/undefined, just show empty state
        // setError('No lab results data found.'); // Or handle silently
        console.log("Lab results data is null or undefined.");
        return; // Parsed results will remain empty, showing "No results"
      }

      let parsedData: LabTestResult[] = [];

      // 2. If it's already an array of objects (most likely case if Prisma parsed it correctly)
      if (Array.isArray(resultsJson)) {
        // Basic validation: Check if it looks like the expected structure
        // We assume Prisma correctly parsed the JSON array of objects.
        // Further validation can be added if needed.
        parsedData = resultsJson as LabTestResult[]; // Cast assuming structure is correct based on your data
        // Optional: Add a quick check on the first item if array is not empty
        // if (parsedData.length > 0) {
        //   const firstItem = parsedData[0];
        //   if (typeof firstItem !== 'object' || firstItem === null ||
        //       !('category' in firstItem) || !('testName' in firstItem)) {
        //     throw new Error('Lab results data structure is invalid.');
        //   }
        // }
      }
      // 3. If it's a string (less likely if Prisma handled it, but possible if stored incorrectly)
      else if (typeof resultsJson === 'string') {
        console.warn("Lab results appear to be a string. Attempting to parse...");
        // Try parsing it as JSON
        const parsedFromString = JSON.parse(resultsJson);
        if (Array.isArray(parsedFromString)) {
          parsedData = parsedFromString as LabTestResult[];
        } else {
          throw new Error('Parsed string is not an array.');
        }
      }
      // 4. If it's an object (but not an array) - unexpected for your data
      else if (typeof resultsJson === 'object') {
         // This could happen if the JSON in the DB was a single object, not an array
         // Or if Prisma somehow didn't parse it as expected (unlikely).
         console.warn("Lab results appear to be a non-array object.", resultsJson);
         throw new Error('Lab results data is an unexpected object type.');
      }
      // 5. If it's a primitive like number/boolean - invalid for your data
      else {
         throw new Error(`Lab results data is of an unexpected type: ${typeof resultsJson}`);
      }

      // --- Validate the structure of the parsed data (basic check) ---
      if (parsedData.length > 0) {
        const sampleItem = parsedData[0];
        // Check if the first item has the expected keys (basic structural check)
        if (
          typeof sampleItem !== 'object' ||
          sampleItem === null ||
          !('category' in sampleItem) ||
          !('testName' in sampleItem) ||
          !('result' in sampleItem) ||
          !('normalRange' in sampleItem)
        ) {
          throw new Error('Lab results data structure is invalid. Missing expected fields.');
        }
        // Optional: Check types of fields if needed (e.g., ensure category is string)
        // if (typeof sampleItem.category !== 'string') { ... }
      }


      setParsedResults(parsedData);
    } catch (err: any) {
      console.error("Error processing lab results:", err);
      // Provide a more user-friendly error message
      const errorMessage = err?.message ? `Error: ${err.message}` : 'Failed to process lab results data.';
      setError(errorMessage);
      setParsedResults([]); // Ensure results are cleared on error
    }
  }, [resultsJson]); // Re-run if resultsJson changes

  // --- Display Logic ---
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded">
        <p className="font-medium">{error}</p>
        {/* Optionally, show raw data for debugging (be careful with sensitive data) */}
        {/* <details className="mt-2">
          <summary>Debug Info (Raw Data)</summary>
          <pre className="text-xs overflow-auto">{JSON.stringify(resultsJson, null, 2)}</pre>
        </details> */}
      </div>
    );
  }

  if (parsedResults.length === 0) {
    // This covers the case where resultsJson was null/undefined or parsing resulted in an empty array
    return <p className="text-muted-foreground italic">No lab results data available for this test.</p>;
  }

  // --- Group and Render Table (same as before, now using validated parsedResults) ---
  const groupedResults: { [category: string]: LabTestResult[] } = {};
  parsedResults.forEach((result) => {
    // Ensure category exists as a key
    if (!groupedResults[result.category]) {
      groupedResults[result.category] = [];
    }
    groupedResults[result.category].push(result);
  });

  return (
    <div className="overflow-x-auto border rounded-lg">
      {Object.entries(groupedResults).map(([category, tests]) => (
        <div key={category} className="mb-6 last:mb-0">
          <h3 className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 sticky left-0 z-10">{category}</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-10 bg-gray-50">Test Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tests.map((test, index) => {
                // Determine result styling
                let resultClassName = '';
                const lowerCaseResult = test.result?.toLowerCase();
                if (lowerCaseResult === 'positive') {
                  resultClassName = 'font-semibold text-green-600';
                } else if (lowerCaseResult === 'negative') {
                  resultClassName = 'font-semibold text-red-600';
                } else if (lowerCaseResult === 'reactive') {
                   resultClassName = 'font-semibold text-yellow-600';
                }
                // Add more conditions as needed

                return (
                  <tr key={`${category}-${test.testName}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-0">{test.testName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={resultClassName}>{test.result}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.normalRange || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}