-- DropIndex
DROP INDEX "FoundationClassLeader_memberId_foundationClassId_key";

-- AlterTable
ALTER TABLE "FoundationClassLeader" ADD COLUMN     "isMainLeader" BOOLEAN NOT NULL DEFAULT false;
