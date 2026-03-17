import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  // --- Admin Dashboard ---

  @Get('admin')
  getAdminDashboard() {
    return this.service.getAdminDashboard();
  }

  // --- Foundation Class Leader Dashboard ---

  @Get('foundation-class/:classId')
  getFoundationClassLeaderDashboard(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getFoundationClassLeaderDashboard(classId);
  }

  // --- Department Leader Dashboard ---

  @Get('department/:departmentId')
  getDepartmentLeaderDashboard(@Param('departmentId', ParseIntPipe) departmentId: number) {
    return this.service.getDepartmentLeaderDashboard(departmentId);
  }

  // --- Attendance Analytics ---

  @Get('attendance/weekly')
  getWeeklyAttendanceSummary() {
    return this.service.getWeeklyAttendanceSummary();
  }

  @Get('attendance/class/:classId')
  getAttendanceByClass(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getAttendanceByClass(classId);
  }

  // --- Tithe Analytics ---

  @Get('tithe/monthly')
  getMonthlyTitheSummary() {
    return this.service.getMonthlyTitheSummary();
  }

  @Get('tithe/range')
  getTitheByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getTitheByDateRange(startDate, endDate);
  }

  // --- Member Statistics ---

  @Get('members/statistics')
  getMemberStatistics() {
    return this.service.getMemberStatistics();
  }

  // --- Foundation Class Statistics ---

  @Get('foundation-classes/statistics')
  getFoundationClassStatistics() {
    return this.service.getFoundationClassStatistics();
  }

  // --- Department Statistics ---

  @Get('departments/statistics')
  getDepartmentStatistics() {
    return this.service.getDepartmentStatistics();
  }
}
