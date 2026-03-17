import { Controller, Post, Param, Get, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { FoundationClassMembersService } from './foundation-class-members.service';

interface AssignMemberDto {
  memberId: number;
  foundationClassId: number;
}

@Controller('foundation-class-members')
export class FoundationClassMembersController {
  constructor(private readonly service: FoundationClassMembersService) {}

  // Assign a member to a foundation class
  @Post('assign')
  async assignMember(@Body() dto: AssignMemberDto) {
    return this.service.assignMember(dto);
  }

  // Get a member's class
  @Get('GetMember/:id')
  async getMemberClass(@Param('id', ParseIntPipe) memberId: number) {
    return this.service.getMemberClass(memberId);
  }

  // Remove a member from class
  @Delete('DeleteMember/:id')
  async removeMember(@Param('id', ParseIntPipe) memberId: number) {
    return this.service.removeMember(memberId);
  }

  // List all members in a class
  @Get('ListAll/:id')
  async listClassMembers(@Param('id', ParseIntPipe) foundationClassId: number) {
    return this.service.listClassMembers(foundationClassId);
  }
}