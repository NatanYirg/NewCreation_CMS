import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { TitheType } from '@prisma/client';
import { TitheService } from './tithe.service';

@Controller('tithe')
export class TitheController {
  constructor(private readonly service: TitheService) {}

  // --- Record tithe ---

  @Post()
  recordTithe(
    @Body()
    body: {
      amount: number;
      type: TitheType;
      name?: string;
      email?: string;
      phone?: string;
      memberId?: number;
      foundationClassId?: number;
      date: string;
      notes?: string;
    },
  ) {
    return this.service.recordTithe(body);
  }

  // --- Get all tithes ---

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // --- Get tithe by ID ---

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // --- Delete tithe ---

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // --- Member tithe history ---

  @Get('member/:memberId')
  getMemberTithes(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getMemberTithes(memberId);
  }

  // --- Analytics ---

  @Get('analytics/range')
  getTithesByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getTithesByDateRange(startDate, endDate);
  }

  @Get('analytics/monthly')
  getMonthlyTotal(@Query('year') year: string, @Query('month') month: string) {
    return this.service.getMonthlyTotal(Number(year), Number(month));
  }

  @Get('analytics/yearly')
  getYearlyTotal(@Query('year') year: string) {
    return this.service.getYearlyTotal(Number(year));
  }

  @Get('analytics/all-time')
  getAllTimeStats() {
    return this.service.getAllTimeStats();
  }

  @Get('analytics/top-contributors')
  getTopContributors(@Query('limit') limit?: string) {
    return this.service.getTopContributors(limit ? Number(limit) : 10);
  }

  // --- Foundation class tithes ---

  @Get('foundation-class/:classId')
  getTithesByFoundationClass(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getTithesByFoundationClass(classId);
  }

  @Get('foundation-class/:classId/stats')
  getFoundationClassStats(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getFoundationClassStats(classId);
  }
}
