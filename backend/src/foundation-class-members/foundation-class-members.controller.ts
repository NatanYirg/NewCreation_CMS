import { Controller, Post, Patch, Param, Get, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { FoundationClassMembersService } from './foundation-class-members.service';

interface AssignMemberDto {
  memberId: number;
  foundationClassId: number;
}

@Controller('foundation-class-members')
export class FoundationClassMembersController {
  constructor(private readonly service: FoundationClassMembersService) {}

  // Assign (or re-assign/transfer) a member to a foundation class
  @Post('assign')
  assignMember(@Body() dto: AssignMemberDto) {
    return this.service.assignMember(dto);
  }

  // Bulk assign multiple members to a class at once
  @Post('bulk-assign')
  bulkAssign(@Body() body: { foundationClassId: number; memberIds: number[] }) {
    return this.service.bulkAssign(body.foundationClassId, body.memberIds);
  }

  // Explicit transfer to a new class
  @Patch('transfer/:memberId')
  transferMember(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body('foundationClassId', ParseIntPipe) foundationClassId: number,
  ) {
    return this.service.transferMember(memberId, foundationClassId);
  }

  // Get a member's current active class
  @Get('member/:memberId')
  getMemberClass(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getMemberClass(memberId);
  }

  // Get full class history for a member
  @Get('member/:memberId/history')
  getMemberClassHistory(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getMemberClassHistory(memberId);
  }

  // Remove a member from their current class
  @Delete('member/:memberId')
  removeMember(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.removeMember(memberId);
  }

  // List all active members in a class
  @Get('class/:classId')
  listClassMembers(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.listClassMembers(classId);
  }

  // List members with no foundation class (children, youth, unassigned)
  @Get('unassigned')
  listMembersWithoutClass() {
    return this.service.listMembersWithoutClass();
  }
}
