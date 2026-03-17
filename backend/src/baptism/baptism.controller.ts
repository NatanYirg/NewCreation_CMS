import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BaptismService } from './baptism.service';

@Controller('baptism')
export class BaptismController {
  constructor(private readonly service: BaptismService) {}

  // --- Baptism Rounds ---

  @Post('rounds')
  createRound(@Body() body: { name: string; date: string; notes?: string }) {
    return this.service.createRound(body);
  }

  @Get('rounds')
  findAllRounds() {
    return this.service.findAllRounds();
  }

  @Get('rounds/:id')
  findRound(@Param('id', ParseIntPipe) id: number) {
    return this.service.findRound(id);
  }

  @Put('rounds/:id')
  updateRound(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; date?: string; notes?: string },
  ) {
    return this.service.updateRound(id, body);
  }

  @Delete('rounds/:id')
  deleteRound(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteRound(id);
  }

  // --- Add/Remove members ---

  @Post('rounds/:id/members')
  addMemberToRound(
    @Param('id', ParseIntPipe) roundId: number,
    @Body() body: { memberId: number },
  ) {
    return this.service.addMemberToRound(roundId, body.memberId);
  }

  @Delete('rounds/:id/members/:memberId')
  removeMemberFromRound(
    @Param('id', ParseIntPipe) roundId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.service.removeMemberFromRound(roundId, memberId);
  }

  @Get('rounds/:id/members')
  getMembersInRound(@Param('id', ParseIntPipe) roundId: number) {
    return this.service.getMembersInRound(roundId);
  }

  // --- Member baptism history ---

  @Get('member/:memberId')
  getMemberBaptisms(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getMemberBaptisms(memberId);
  }

  // --- Statistics ---

  @Get('rounds/:id/stats')
  getRoundStats(@Param('id', ParseIntPipe) roundId: number) {
    return this.service.getRoundStats(roundId);
  }

  @Get('stats/all')
  getAllRoundsStats() {
    return this.service.getAllRoundsStats();
  }
}
