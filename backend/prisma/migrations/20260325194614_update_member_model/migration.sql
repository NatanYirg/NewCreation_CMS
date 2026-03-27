-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "BaptismStatus" AS ENUM ('BAPTIZED', 'NOT_BAPTIZED');

-- AlterEnum MemberStatus (add LEFT, keep LEFT_CHURCH temporarily)
BEGIN;
CREATE TYPE "MemberStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'LEFT', 'DECEASED');
ALTER TABLE "public"."Member" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Member" ALTER COLUMN "status" TYPE "MemberStatus_new" USING (
  CASE "status"::text
    WHEN 'LEFT_CHURCH' THEN 'LEFT'
    ELSE "status"::text
  END::"MemberStatus_new"
);
ALTER TYPE "MemberStatus" RENAME TO "MemberStatus_old";
ALTER TYPE "MemberStatus_new" RENAME TO "MemberStatus";
DROP TYPE "public"."MemberStatus_old";
ALTER TABLE "Member" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum MemberType (REGULAR -> ADULT)
BEGIN;
CREATE TYPE "MemberType_new" AS ENUM ('ADULT', 'YOUTH', 'CHILD');
ALTER TABLE "public"."Member" ALTER COLUMN "memberType" DROP DEFAULT;
ALTER TABLE "Member" ALTER COLUMN "memberType" TYPE "MemberType_new" USING (
  CASE "memberType"::text
    WHEN 'REGULAR' THEN 'ADULT'
    ELSE "memberType"::text
  END::"MemberType_new"
);
ALTER TYPE "MemberType" RENAME TO "MemberType_old";
ALTER TYPE "MemberType_new" RENAME TO "MemberType";
DROP TYPE "public"."MemberType_old";
ALTER TABLE "Member" ALTER COLUMN "memberType" SET DEFAULT 'ADULT';
COMMIT;

-- AlterTable
ALTER TABLE "Member"
  DROP COLUMN "address",
  DROP COLUMN "age",
  ADD COLUMN "alternativePhone" TEXT,
  ADD COLUMN "baptismStatus"    "BaptismStatus" NOT NULL DEFAULT 'NOT_BAPTIZED',
  ADD COLUMN "birthDate"        DATE,
  ADD COLUMN "city"             TEXT,
  ADD COLUMN "houseNumber"      TEXT,
  ADD COLUMN "joinedDate"       DATE,
  ADD COLUMN "maritalStatus"    "MaritalStatus",
  ADD COLUMN "middleName"       TEXT NOT NULL DEFAULT '',
  ADD COLUMN "notes"            TEXT,
  ADD COLUMN "previousChurch"   TEXT,
  ADD COLUMN "salvationDate"    DATE,
  ADD COLUMN "subCity"          TEXT,
  ADD COLUMN "woreda"           TEXT,
  ALTER COLUMN "memberType" SET DEFAULT 'ADULT';

-- Remove temporary default so future inserts must supply middleName
ALTER TABLE "Member" ALTER COLUMN "middleName" DROP DEFAULT;

-- Indexes
CREATE INDEX "Member_status_idx" ON "Member"("status");
CREATE INDEX "Member_memberType_idx" ON "Member"("memberType");
CREATE INDEX "Member_phone_idx" ON "Member"("phone");
CREATE INDEX "Member_firstName_middleName_lastName_idx" ON "Member"("firstName", "middleName", "lastName");
