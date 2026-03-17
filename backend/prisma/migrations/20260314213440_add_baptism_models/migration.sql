-- CreateTable
CREATE TABLE "BaptismRound" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaptismRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaptismMember" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "baptismRoundId" INTEGER NOT NULL,
    "baptizedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaptismMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BaptismRound_name_key" ON "BaptismRound"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BaptismMember_memberId_baptismRoundId_key" ON "BaptismMember"("memberId", "baptismRoundId");

-- AddForeignKey
ALTER TABLE "BaptismMember" ADD CONSTRAINT "BaptismMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaptismMember" ADD CONSTRAINT "BaptismMember_baptismRoundId_fkey" FOREIGN KEY ("baptismRoundId") REFERENCES "BaptismRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
