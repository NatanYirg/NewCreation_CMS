import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AssignTeacherDto {
  memberId: number;
  foundationClassId: number;
}

@Injectable()
export class FoundationClassTeachersService {
  constructor(private prisma: PrismaService) {}

  assignTeacher(dto: AssignTeacherDto) {
    return this.prisma.foundationClassTeacher.create({
      data: {
        memberId: dto.memberId,
        foundationClassId: dto.foundationClassId,
      },
    });
  }

  getTeachersForClass(classId: number) {
    return this.prisma.foundationClassTeacher.findMany({
      where: { foundationClassId: classId },
      include: { member: true },
    });
  }

  removeTeacher(id: number) {
    return this.prisma.foundationClassTeacher.delete({
      where: { id },
    });
  }
}