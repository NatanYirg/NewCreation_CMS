import { Controller, Post, Get, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FoundationClassLeadersService } from './foundation-class-leaders.service';

interface AssignLeaderDto {
  memberId: number;
  foundationClassId: number;
  isMainLeader?: boolean;
}

@Controller('foundation-class-leaders')
export class FoundationClassLeadersController {

  constructor(private service: FoundationClassLeadersService) {}

  @Post('AssignLeader/')
  assignLeader(@Body() dto: AssignLeaderDto) {
    return this.service.assignLeader(dto);
  }

  @Get('GetLeader/:classId')
  getLeaders(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getClassLeaders(classId);
  }

  @Get('member/:memberId')
  getMemberLeaderships(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getMemberLeaderships(memberId);
  }

  @Get('MainLeader/:classId')
  getMainLeader(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getMainLeader(classId);
  }

  @Delete(':id')
  removeLeader(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeLeader(id);
  }
}