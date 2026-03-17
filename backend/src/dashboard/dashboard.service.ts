import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // --- Admin Dashboard ---

  async getAdminDashboard() {
    const [
      totalUsers,
      totalMembers,
      totalLeaders,
      totalFoundationClasses,
      totalDepartments,
      activeMembers,
      inactiveMembers,
      totalTithe,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.member.count(),
      this.prisma.foundationClassLeader.count(),
      this.prisma.foundationClass.count(),
      this.prisma.department.count(),
      this.prisma.member.count({ where: { status: 'ACTIVE' } }),
      this.prisma.member.count({ where: { status: 'INACTIVE' } }),
      this.prisma.tithe.aggregate({ _sum: { amount: true } }),
    ]);

    const weeklyAttendance = await this.getWeeklyAttendanceSummary();
    const monthlyTithe = await this.getMonthlyTitheSummary();

    return {
      overview: {
        totalUsers,
        totalMembers,
        totalLeaders,
        totalFoundationClasses,
        totalDepartments,
        activeMembers,
        inactiveMembers,
      },
      financials: {
        totalTithe: totalTithe._sum.amount || 0,
      },
      attendance: weeklyAttendance,
      tithe: monthlyTithe,
    };
  }

  // --- Foundation Class Leader Dashboard ---

  async getFoundationClassLeaderDashboard(foundationClassId: number) {
    const [foundationClass, members, leaders, teachers, sessions] = await Promise.all([
      this.prisma.foundationClass.findUnique({
        where: { id: foundationClassId },
        include: {
          members: { include: { member: true } },
          leaders: { include: { member: true } },
          teachers: { include: { member: true } },
        },
      }),
      this.prisma.foundationClassMember.count({ where: { foundationClassId } }),
      this.prisma.foundationClassLeader.count({ where: { foundationClassId } }),
      this.prisma.foundationClassTeacher.count({ where: { foundationClassId } }),
      this.prisma.attendanceSession.count({ where: { foundationClassId } }),
    ]);

    const recentAttendance = await this.prisma.attendanceSession.findMany({
      where: { foundationClassId },
      include: { attendances: true },
      orderBy: { sessionDate: 'desc' },
      take: 5,
    });

    const classTithe = await this.prisma.tithe.aggregate({
      where: { foundationClassId },
      _sum: { amount: true },
    });

    return {
      class: foundationClass,
      statistics: {
        totalMembers: members,
        totalLeaders: leaders,
        totalTeachers: teachers,
        totalSessions: sessions,
      },
      recentAttendance: recentAttendance.map((session) => ({
        sessionId: session.id,
        date: session.sessionDate,
        present: session.attendances.filter((a) => a.present).length,
        absent: session.attendances.filter((a) => !a.present).length,
        total: session.attendances.length,
      })),
      tithe: {
        total: classTithe._sum.amount || 0,
      },
    };
  }

  // --- Department Leader Dashboard ---

  async getDepartmentLeaderDashboard(departmentId: number) {
    const [department, members, leaders] = await Promise.all([
      this.prisma.department.findUnique({
        where: { id: departmentId },
        include: {
          members: { include: { member: true } },
          leaders: { include: { member: true } },
        },
      }),
      this.prisma.departmentMember.count({ where: { departmentId } }),
      this.prisma.departmentLeader.count({ where: { departmentId } }),
    ]);

    return {
      department,
      statistics: {
        totalMembers: members,
        totalLeaders: leaders,
      },
    };
  }

  // --- Attendance Analytics ---

  async getWeeklyAttendanceSummary() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const sessions = await this.prisma.attendanceSession.findMany({
      where: {
        sessionDate: { gte: weekStart },
      },
      include: { attendances: true, foundationClass: true },
    });

    const summary = sessions.map((session) => ({
      date: session.sessionDate,
      class: session.foundationClass.name,
      present: session.attendances.filter((a) => a.present).length,
      absent: session.attendances.filter((a) => !a.present).length,
      total: session.attendances.length,
    }));

    const totals = {
      totalPresent: summary.reduce((sum, s) => sum + s.present, 0),
      totalAbsent: summary.reduce((sum, s) => sum + s.absent, 0),
      totalAttendance: summary.reduce((sum, s) => sum + s.total, 0),
    };

    return { summary, totals };
  }

  async getAttendanceByClass(foundationClassId: number) {
    const sessions = await this.prisma.attendanceSession.findMany({
      where: { foundationClassId },
      include: { attendances: true },
      orderBy: { sessionDate: 'desc' },
    });

    return sessions.map((session) => ({
      sessionId: session.id,
      date: session.sessionDate,
      present: session.attendances.filter((a) => a.present).length,
      absent: session.attendances.filter((a) => !a.present).length,
      total: session.attendances.length,
      percentage: session.attendances.length > 0
        ? Math.round((session.attendances.filter((a) => a.present).length / session.attendances.length) * 100)
        : 0,
    }));
  }

  // --- Tithe Analytics ---

  async getMonthlyTitheSummary() {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const tithes = await this.prisma.tithe.findMany({
      where: {
        date: { gte: monthStart, lte: monthEnd },
      },
    });

    const total = tithes.reduce((sum, t) => sum + Number(t.amount), 0);
    const named = tithes
      .filter((t) => t.type === 'NAMED')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const anonymous = tithes
      .filter((t) => t.type === 'ANONYMOUS')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
      total,
      named,
      anonymous,
      count: tithes.length,
    };
  }

  async getTitheByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const tithes = await this.prisma.tithe.findMany({
      where: {
        date: { gte: start, lte: end },
      },
    });

    const total = tithes.reduce((sum, t) => sum + Number(t.amount), 0);
    const named = tithes
      .filter((t) => t.type === 'NAMED')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const anonymous = tithes
      .filter((t) => t.type === 'ANONYMOUS')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      startDate,
      endDate,
      total,
      named,
      anonymous,
      count: tithes.length,
    };
  }

  // --- Member Statistics ---

  async getMemberStatistics() {
    const [total, active, inactive, deceased, leftChurch] = await Promise.all([
      this.prisma.member.count(),
      this.prisma.member.count({ where: { status: 'ACTIVE' } }),
      this.prisma.member.count({ where: { status: 'INACTIVE' } }),
      this.prisma.member.count({ where: { status: 'DECEASED' } }),
      this.prisma.member.count({ where: { status: 'LEFT_CHURCH' } }),
    ]);

    return {
      total,
      active,
      inactive,
      deceased,
      leftChurch,
    };
  }

  // --- Foundation Class Statistics ---

  async getFoundationClassStatistics() {
    const classes = await this.prisma.foundationClass.findMany({
      include: {
        members: true,
        leaders: true,
        teachers: true,
      },
    });

    return classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      level: cls.level,
      members: cls.members.length,
      leaders: cls.leaders.length,
      teachers: cls.teachers.length,
    }));
  }

  // --- Department Statistics ---

  async getDepartmentStatistics() {
    const departments = await this.prisma.department.findMany({
      include: {
        members: true,
        leaders: true,
      },
    });

    return departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      members: dept.members.length,
      leaders: dept.leaders.length,
    }));
  }
}
