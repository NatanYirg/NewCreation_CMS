/*
  Warnings:

  - A unique constraint covering the columns `[memberId]` on the table `FoundationClassMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FoundationClassMember_memberId_foundationClassId_key";

-- CreateIndex
CREATE UNIQUE INDEX "FoundationClassMember_memberId_key" ON "FoundationClassMember"("memberId");
