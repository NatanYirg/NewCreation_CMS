-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "present" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
