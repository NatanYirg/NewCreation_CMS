import { Controller, Post, Get, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FoundationClassTeachersService } from './foundation-class-teachers.service';

interface AssignTeacherDto {
  memberId: number;
  foundationClassId: number;
}

@Controller('foundation-class-teachers')
export class FoundationClassTeachersController {
  constructor(private service: FoundationClassTeachersService) {}

  @Post('AssignTeacher')
  assignTeacher(@Body() dto: AssignTeacherDto) {
    return this.service.assignTeacher(dto);
  }

  @Get('GetById/:classId')
  getTeachers(@Param('classId', ParseIntPipe) classId: number) {
    return this.service.getTeachersForClass(classId);
  }

  @Delete(':id')
  removeTeacher(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeTeacher(id);
  }
}