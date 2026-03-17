import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  // --- Sessions ---

  @Post('sessions')
  createSession(
    @Body() body: { foundationClassId: number; sessionDate: string; notes?: string },
  ) {
    return this.service.createSession(body.foundationClassId, body.sessionDate, body.notes);
  }

  @Get('sessions/class/:classId')
  getSessionsByClass(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getSessionsByClass(classId);
  }

  @Get('sessions/:id/roster')
  getSessionRoster(@Param('id', ParseIntPipe) sessionId: number) {
    return this.service.getSessionRoster(sessionId);
  }

  @Get('sessions/:id/summary')
  getSessionSummary(@Param('id', ParseIntPipe) sessionId: number) {
    return this.service.getSessionSummary(sessionId);
  }

  @Get('sessions/:id')
  getSession(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSession(id);
  }

  @Delete('sessions/:id')
  deleteSession(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteSession(id);
  }

  // --- Attendance records ---

  @Post('sessions/:id/record')
  recordAttendance(
    @Param('id', ParseIntPipe) sessionId: number,
    @Body() body: { memberId: number; present: boolean },
  ) {
    return this.service.recordAttendance(sessionId, body.memberId, body.present);
  }

  @Post('sessions/:id/bulk')
  recordBulkAttendance(
    @Param('id', ParseIntPipe) sessionId: number,
    @Body() body: { records: { memberId: number; present: boolean }[] },
  ) {
    return this.service.recordBulkAttendance(sessionId, body.records);
  }

  @Get('member/:memberId/class/:classId')
  getMemberAttendance(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('classId', ParseIntPipe) classId: number,
  ) {
    return this.service.getMemberAttendance(memberId, classId);
  }

  @Get('weekly')
  getWeeklySummary(@Query('weekStart') weekStart: string) {
    return this.service.getWeeklySummary(weekStart);
  }
}
