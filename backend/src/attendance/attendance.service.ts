import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // --- Sessions ---

  async createSession(foundationClassId: number, sessionDate: string, notes?: string) {
    // Verify class exists
    const cls = await this.prisma.foundationClass.findUnique({ where: { id: foundationClassId } });
    if (!cls) throw new NotFoundException(`Foundation class #${foundationClassId} not found`);

    return this.prisma.attendanceSession.create({
      data: { foundationClassId, sessionDate: new Date(sessionDate), notes },
    });
  }

  getSessionsByClass(foundationClassId: number) {
    return this.prisma.attendanceSession.findMany({
      where: { foundationClassId },
      include: { attendances: { include: { member: true } } },
      orderBy: { sessionDate: 'desc' },
    });
  }

  async getSession(sessionId: number) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { attendances: { include: { member: true } }, foundationClass: true },
    });
    if (!session) throw new NotFoundException(`Session #${sessionId} not found`);
    return session;
  }

  deleteSession(sessionId: number) {
    return this.prisma.attendanceSession.delete({ where: { id: sessionId } });
  }

  // --- Attendance records ---

  async recordAttendance(sessionId: number, memberId: number, present: boolean) {
    const existing = await this.prisma.attendance.findFirst({
      where: { attendanceSessionId: sessionId, memberId },
    });
    if (existing) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: { present },
      });
    }
    return this.prisma.attendance.create({
      data: { attendanceSessionId: sessionId, memberId, present },
    });
  }

  // Bulk record: submit full class attendance in one call
  async recordBulkAttendance(sessionId: number, records: { memberId: number; present: boolean }[]) {
    const session = await this.prisma.attendanceSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException(`Session #${sessionId} not found`);

    const ops = records.map((r) =>
      this.prisma.attendance.upsert({
        where: { attendanceSessionId_memberId: { attendanceSessionId: sessionId, memberId: r.memberId } },
        update: { present: r.present },
        create: { attendanceSessionId: sessionId, memberId: r.memberId, present: r.present },
      }),
    );
    return this.prisma.$transaction(ops);
  }

  // Get attendance summary for a session
  async getSessionSummary(sessionId: number) {
    const records = await this.prisma.attendance.findMany({
      where: { attendanceSessionId: sessionId },
      include: { member: true },
    });
    const present = records.filter((r) => r.present).length;
    return { total: records.length, present, absent: records.length - present, records };
  }

  // Get all class members with their attendance status for a session
  // This is what the frontend uses to render the checkbox list
  async getSessionRoster(sessionId: number) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        foundationClass: {
          include: {
            members: { include: { member: true } },
          },
        },
        attendances: true,
      },
    });
    if (!session) throw new NotFoundException(`Session #${sessionId} not found`);

    // Map each class member with their present/absent status
    return session.foundationClass.members.map((fm) => {
      const record = session.attendances.find((a) => a.memberId === fm.memberId);
      return {
        memberId: fm.memberId,
        firstName: fm.member.firstName,
        lastName: fm.member.lastName,
        photo: fm.member.photo,
        present: record ? record.present : null, // null = not yet recorded
      };
    });
  }
  getMemberAttendance(memberId: number, foundationClassId: number) {
    return this.prisma.attendance.findMany({
      where: {
        memberId,
        session: { foundationClassId },
      },
      include: { session: true },
      orderBy: { session: { sessionDate: 'desc' } },
    });
  }

  // Weekly attendance summary across all classes
  async getWeeklySummary(weekStart: string) {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return this.prisma.attendanceSession.findMany({
      where: { sessionDate: { gte: start, lt: end } },
      include: {
        foundationClass: true,
        attendances: true,
      },
    });
  }
}
