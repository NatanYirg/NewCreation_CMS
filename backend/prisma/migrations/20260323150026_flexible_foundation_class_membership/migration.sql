-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('REGULAR', 'CHILD', 'YOUTH');

-- DropIndex
DROP INDEX "FoundationClassMember_memberId_key";

-- AlterTable
ALTER TABLE "FoundationClassMember" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "leftAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "memberType" "MemberType" NOT NULL DEFAULT 'REGULAR';

-- CreateIndex
CREATE INDEX "FoundationClassMember_memberId_idx" ON "FoundationClassMember"("memberId");

-- CreateIndex
CREATE INDEX "FoundationClassMember_foundationClassId_idx" ON "FoundationClassMember"("foundationClassId");
