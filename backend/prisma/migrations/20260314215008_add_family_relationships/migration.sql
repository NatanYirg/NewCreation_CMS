-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('SPOUSE', 'PARENT', 'CHILD', 'SIBLING');

-- CreateTable
CREATE TABLE "FamilyRelationship" (
    "id" SERIAL NOT NULL,
    "memberId1" INTEGER NOT NULL,
    "memberId2" INTEGER NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FamilyRelationship_memberId1_idx" ON "FamilyRelationship"("memberId1");

-- CreateIndex
CREATE INDEX "FamilyRelationship_memberId2_idx" ON "FamilyRelationship"("memberId2");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyRelationship_memberId1_memberId2_key" ON "FamilyRelationship"("memberId1", "memberId2");

-- AddForeignKey
ALTER TABLE "FamilyRelationship" ADD CONSTRAINT "FamilyRelationship_memberId1_fkey" FOREIGN KEY ("memberId1") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyRelationship" ADD CONSTRAINT "FamilyRelationship_memberId2_fkey" FOREIGN KEY ("memberId2") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
