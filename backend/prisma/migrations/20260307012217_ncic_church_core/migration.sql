-- CreateTable
CREATE TABLE "FoundationClass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoundationClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoundationClassMember" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "foundationClassId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoundationClassMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoundationClassLeader" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "foundationClassId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoundationClassLeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoundationClassTeacher" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "foundationClassId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoundationClassTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentMember" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentLeader" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentLeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceSession" (
    "id" SERIAL NOT NULL,
    "foundationClassId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "attendanceSessionId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoundationClass_name_key" ON "FoundationClass"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FoundationClassMember_memberId_foundationClassId_key" ON "FoundationClassMember"("memberId", "foundationClassId");

-- CreateIndex
CREATE UNIQUE INDEX "FoundationClassLeader_memberId_foundationClassId_key" ON "FoundationClassLeader"("memberId", "foundationClassId");

-- CreateIndex
CREATE UNIQUE INDEX "FoundationClassTeacher_memberId_foundationClassId_key" ON "FoundationClassTeacher"("memberId", "foundationClassId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentMember_memberId_departmentId_key" ON "DepartmentMember"("memberId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentLeader_memberId_departmentId_key" ON "DepartmentLeader"("memberId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_attendanceSessionId_memberId_key" ON "Attendance"("attendanceSessionId", "memberId");

-- AddForeignKey
ALTER TABLE "FoundationClassMember" ADD CONSTRAINT "FoundationClassMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundationClassMember" ADD CONSTRAINT "FoundationClassMember_foundationClassId_fkey" FOREIGN KEY ("foundationClassId") REFERENCES "FoundationClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundationClassLeader" ADD CONSTRAINT "FoundationClassLeader_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundationClassLeader" ADD CONSTRAINT "FoundationClassLeader_foundationClassId_fkey" FOREIGN KEY ("foundationClassId") REFERENCES "FoundationClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundationClassTeacher" ADD CONSTRAINT "FoundationClassTeacher_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundationClassTeacher" ADD CONSTRAINT "FoundationClassTeacher_foundationClassId_fkey" FOREIGN KEY ("foundationClassId") REFERENCES "FoundationClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMember" ADD CONSTRAINT "DepartmentMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMember" ADD CONSTRAINT "DepartmentMember_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentLeader" ADD CONSTRAINT "DepartmentLeader_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentLeader" ADD CONSTRAINT "DepartmentLeader_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_foundationClassId_fkey" FOREIGN KEY ("foundationClassId") REFERENCES "FoundationClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_attendanceSessionId_fkey" FOREIGN KEY ("attendanceSessionId") REFERENCES "AttendanceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
