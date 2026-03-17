-- AlterTable
ALTER TABLE "Tithe" ADD COLUMN     "email" TEXT,
ADD COLUMN     "foundationClassId" INTEGER,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;

-- AddForeignKey
ALTER TABLE "Tithe" ADD CONSTRAINT "Tithe_foundationClassId_fkey" FOREIGN KEY ("foundationClassId") REFERENCES "FoundationClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
