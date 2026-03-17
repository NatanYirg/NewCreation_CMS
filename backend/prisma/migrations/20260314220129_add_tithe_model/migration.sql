-- CreateEnum
CREATE TYPE "TitheType" AS ENUM ('NAMED', 'ANONYMOUS');

-- CreateTable
CREATE TABLE "Tithe" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "TitheType" NOT NULL,
    "memberId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tithe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tithe" ADD CONSTRAINT "Tithe_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
