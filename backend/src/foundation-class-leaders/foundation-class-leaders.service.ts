import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AssignLeaderDto {
  memberId: number;
  foundationClassId: number;
  isMainLeader?: boolean;
}

@Injectable()
export class FoundationClassLeadersService {
  constructor(private prisma: PrismaService) {}

  async assignLeader(dto: AssignLeaderDto) {
    // If assigning a main leader, ensure only one exists
    if (dto.isMainLeader) {
      const existingMain = await this.prisma.foundationClassLeader.findFirst({
        where: {
          foundationClassId: dto.foundationClassId,
          isMainLeader: true,
        },
      });

      if (existingMain) {
        throw new BadRequestException('This class already has a main leader');
      }
    }

    return this.prisma.foundationClassLeader.create({
      data: dto,
    });
  }

  getClassLeaders(classId: number) {
    return this.prisma.foundationClassLeader.findMany({
      where: { foundationClassId: classId },
      include: { member: true },
    });
  }

  getMemberLeaderships(memberId: number) {
    return this.prisma.foundationClassLeader.findMany({
      where: { memberId },
      include: { foundationClass: true },
    });
  }

  getMainLeader(classId: number) {
    return this.prisma.foundationClassLeader.findFirst({
      where: {
        foundationClassId: classId,
        isMainLeader: true,
      },
      include: { member: true },
    });
  }

  removeLeader(id: number) {
    return this.prisma.foundationClassLeader.delete({
      where: { id },
    });
  }
}