// app/admin/actions.ts
'use server';

// Import your Prisma client instance
// Make sure this path is correct for your project structure
import { prisma } from '@/lib/prisma';
import { VisitStatus } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

/**
 * Action to fetch dashboard statistics
 * Simplified and corrected queries
 */
export async function getDashboardStats() {
    // Opt out of caching for fresh data
    noStore();

    try {
        console.log("Fetching dashboard stats..."); // Debug log

        // --- 1. Total Students ---
        const totalStudents = await prisma.studentInfo.count();
        console.log(`Total Students: ${totalStudents}`); // Debug log

        // --- 2. Active Visits (Not Completed) ---
        const activeVisitsCount = await prisma.visit.count({
            where: {
                // Correct Prisma syntax to exclude COMPLETED status
                status: {
                    not: VisitStatus.COMPLETED
                }
            }
        });
        console.log(`Active Visits: ${activeVisitsCount}`); // Debug log

        // --- 3. Low Stock Medicines ---
        // --- Simplified Approach ---
        // Fetch potentially low stock items and count them in JS.
        // This avoids complex Prisma filtering that might cause issues.
        // We fetch stocks where isActive is true and quantity is low *or* reorderLevel might be low/zero.
        // We'll refine the count in JS.

        // Option A: Fetch all potentially relevant stock items (might be heavy if lots of stock)
        // const allActiveStocks = await prisma.stock.findMany({
        //     where: { isActive: true },
        //     select: { quantity: true, reorderLevel: true }
        // });
        // const lowStockMedicinesCount = allActiveStocks.filter(stock =>
        //     stock.quantity <= (stock.reorderLevel ?? 0) // Treat NULL reorderLevel as 0
        // ).length;

        // Option B: Fetch counts based on simplified DB conditions (recommended)
        // Count items where quantity is <= a small default (e.g., 0) AND reorderLevel is NULL
        const lowStockNullReorderPromise = prisma.stock.count({
            where: {
                isActive: true,
                reorderLevel: null,
                quantity: {
                    lte: 0 // Or another small default threshold
                }
            }
        });

        // Count items where quantity is <= reorderLevel (assuming reorderLevel is NOT NULL)
        const lowStockWithReorderPromise = prisma.stock.count({
            where: {
                isActive: true,
                reorderLevel: {
                    not: null // Explicitly ensure reorderLevel exists
                },
                quantity: {
                    lte: prisma.stock.fields.reorderLevel // Compare quantity to the actual reorderLevel field
                }
            }
        });

        // Run low stock queries in parallel
        const [lowStockNullReorderCount, lowStockWithReorderCount] = await Promise.all([
            lowStockNullReorderPromise,
            lowStockWithReorderPromise
        ]);

        // Total low stock is the sum of both conditions
        const lowStockMedicinesCount = lowStockNullReorderCount + lowStockWithReorderCount;
        console.log(`Low Stock Medicines (Null Reorder): ${lowStockNullReorderCount}`); // Debug log
        console.log(`Low Stock Medicines (With Reorder): ${lowStockWithReorderCount}`); // Debug log
        console.log(`Total Low Stock Medicines: ${lowStockMedicinesCount}`); // Debug log

        // --- 4. Today's Visits ---
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Midnight
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Midnight next day
        // Subtract 1 millisecond to get the last moment of the current day
        endOfDay.setTime(endOfDay.getTime() - 1);

        const todaysVisitsCount = await prisma.visit.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
        console.log(`Today's Visits: ${todaysVisitsCount}`); // Debug log

        // --- Return Results ---
        console.log("Dashboard stats fetched successfully."); // Debug log
        return {
            totalStudents,
            activeVisits: activeVisitsCount,
            lowStockMedicines: lowStockMedicinesCount,
            todaysVisits: todaysVisitsCount
        };

    } catch (error: any) {
        // Improved error logging
        console.error("Failed to fetch dashboard stats:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        // Log the specific Prisma error code if available
        if (error.code) {
            console.error("Prisma Error Code:", error.code);
        }
        // Return default values on error to prevent dashboard crash
        return {
            totalStudents: 0,
            activeVisits: 0,
            lowStockMedicines: 0,
            todaysVisits: 0
        };
    } finally {
        // Optional: Explicitly disconnect. Prisma usually handles this.
        // await prisma.$disconnect();
    }
}

/**
 * Action to fetch recent visits with related data
 */
export async function getRecentVisits(limit: number = 10) {
    // Opt out of caching for fresh data
    noStore();

    try {
        console.log(`Fetching ${limit} recent visits...`); // Debug log
        const recentVisits = await prisma.visit.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                studentInfo: {
                    select: {
                        fullName: true,
                        studentId: true
                    }
                },
                // Ensure the relation name matches your schema
                assignedDoctor: {
                    select: {
                        name: true
                    }
                }
            }
        });
        console.log(`Fetched ${recentVisits.length} recent visits.`); // Debug log
        return recentVisits;
    } catch (error: any) {
        // Improved error logging
        console.error("Failed to fetch recent visits:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        if (error.code) {
            console.error("Prisma Error Code:", error.code);
        }
        // Return empty array on error
        return [];
    } finally {
        // Optional: Explicitly disconnect.
        // await prisma.$disconnect();
    }
}