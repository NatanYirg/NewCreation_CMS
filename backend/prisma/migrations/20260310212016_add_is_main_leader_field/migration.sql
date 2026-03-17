/*
  Warnings:

  - A unique constraint covering the columns `[memberId,foundationClassId]` on the table `FoundationClassLeader` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId,foundationClassId]` on the table `FoundationClassTeacher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FoundationClassLeader_memberId_foundationClassId_key" ON "FoundationClassLeader"("memberId", "foundationClassId");

-- CreateIndex
CREATE UNIQUE INDEX "FoundationClassTeacher_memberId_foundationClassId_key" ON "FoundationClassTeacher"("memberId", "foundationClassId");
