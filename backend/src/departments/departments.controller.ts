import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  // --- Department CRUD ---

  @Post()
  create(@Body() body: { name: string }) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { name: string }) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // --- Members ---

  @Post(':id/members')
  assignMember(@Param('id', ParseIntPipe) id: number, @Body() body: { memberId: number }) {
    return this.service.assignMember(id, body.memberId);
  }

  @Get(':id/members')
  listMembers(@Param('id', ParseIntPipe) id: number) {
    return this.service.listMembers(id);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.service.removeMember(id, memberId);
  }

  // --- Leaders ---

  @Post(':id/leaders')
  assignLeader(@Param('id', ParseIntPipe) id: number, @Body() body: { memberId: number }) {
    return this.service.assignLeader(id, body.memberId);
  }

  @Get(':id/leaders')
  listLeaders(@Param('id', ParseIntPipe) id: number) {
    return this.service.listLeaders(id);
  }

  @Delete(':id/leaders/:memberId')
  removeLeader(
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.service.removeLeader(id, memberId);
  }

  // --- Member's departments ---

  @Get('member/:memberId')
  getMemberDepartments(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getMemberDepartments(memberId);
  }
}
