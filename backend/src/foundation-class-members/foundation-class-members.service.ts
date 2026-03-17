import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AssignMemberDto {
  memberId: number;
  foundationClassId: number;
}

@Injectable()
export class FoundationClassMembersService {
  constructor(private readonly prisma: PrismaService) {}

  // Assign a member to a foundation class
  async assignMember(dto: AssignMemberDto) {
    // Check if the member already has a class
    const existing = await this.prisma.foundationClassMember.findFirst({
      where: { memberId: dto.memberId },
    });

    if (existing) {
      throw new BadRequestException('Member is already assigned to a foundation class.');
    }

    // Assign the member
    return this.prisma.foundationClassMember.create({
      data: {
        memberId: dto.memberId,
        foundationClassId: dto.foundationClassId,
      },
    });
  }

  // Get a member's foundation class
  async getMemberClass(memberId: number) {
    const record = await this.prisma.foundationClassMember.findFirst({
      where: { memberId },
      include: { foundationClass: true },
    });

    if (!record) {
      throw new NotFoundException('Member is not assigned to any foundation class.');
    }

    return record;
  }

  // Remove a member from their foundation class
  async removeMember(memberId: number) {
    const record = await this.prisma.foundationClassMember.findFirst({
      where: { memberId },
    });

    if (!record) {
      throw new NotFoundException('Member is not assigned to any foundation class.');
    }

    return this.prisma.foundationClassMember.delete({
      where: { id: record.id },
    });
  }

  // Optional: List all members in a class
  async listClassMembers(foundationClassId: number) {
    return this.prisma.foundationClassMember.findMany({
      where: { foundationClassId },
      include: { member: true },
    });
  }
}