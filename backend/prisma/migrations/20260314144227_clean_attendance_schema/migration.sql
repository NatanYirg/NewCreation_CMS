/*
  Warnings:

  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `AttendanceSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "AttendanceSession" DROP COLUMN "date",
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "sessionDate" DROP DEFAULT;
