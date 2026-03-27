import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AssignMemberDto {
  memberId: number;
  foundationClassId: number;
}

@Injectable()
export class FoundationClassMembersService {
  constructor(private readonly prisma: PrismaService) {}

  // Assign a member to a foundation class.
  // If already in a class, deactivates the old record (transfer with history).
  async assignMember(dto: AssignMemberDto) {
    const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
    if (!member) throw new NotFoundException(`Member #${dto.memberId} not found`);

    const foundationClass = await this.prisma.foundationClass.findUnique({
      where: { id: dto.foundationClassId },
    });
    if (!foundationClass) throw new NotFoundException(`Foundation class #${dto.foundationClassId} not found`);

    // Deactivate any current active assignment
    await this.prisma.foundationClassMember.updateMany({
      where: { memberId: dto.memberId, isActive: true },
      data: { isActive: false, leftAt: new Date() },
    });

    return this.prisma.foundationClassMember.create({
      data: {
        memberId: dto.memberId,
        foundationClassId: dto.foundationClassId,
        isActive: true,
      },
      include: { foundationClass: true, member: true },
    });
  }

  // Transfer a member from their current class to a new one (explicit transfer)
  async transferMember(memberId: number, newFoundationClassId: number) {
    const current = await this.prisma.foundationClassMember.findFirst({
      where: { memberId, isActive: true },
      include: { foundationClass: true },
    });

    if (!current) {
      throw new NotFoundException('Member is not currently assigned to any foundation class.');
    }

    if (current.foundationClassId === newFoundationClassId) {
      throw new BadRequestException('Member is already in this foundation class.');
    }

    return this.assignMember({ memberId, foundationClassId: newFoundationClassId });
  }

  // Get a member's current (active) foundation class
  async getMemberClass(memberId: number) {
    const record = await this.prisma.foundationClassMember.findFirst({
      where: { memberId, isActive: true },
      include: { foundationClass: true },
    });

    if (!record) {
      throw new NotFoundException('Member is not assigned to any foundation class.');
    }

    return record;
  }

  // Get full class history for a member
  async getMemberClassHistory(memberId: number) {
    return this.prisma.foundationClassMember.findMany({
      where: { memberId },
      include: { foundationClass: true },
      orderBy: { joinedAt: 'asc' },
    });
  }

  // Remove a member from their current class (unassign, no delete — history preserved)
  async removeMember(memberId: number) {
    const record = await this.prisma.foundationClassMember.findFirst({
      where: { memberId, isActive: true },
    });

    if (!record) {
      throw new NotFoundException('Member is not assigned to any foundation class.');
    }

    return this.prisma.foundationClassMember.update({
      where: { id: record.id },
      data: { isActive: false, leftAt: new Date() },
    });
  }

  // List all active members in a class
  async listClassMembers(foundationClassId: number) {
    return this.prisma.foundationClassMember.findMany({
      where: { foundationClassId, isActive: true },
      include: { member: true },
      orderBy: { joinedAt: 'asc' },
    });
  }

  // Bulk assign multiple members to a foundation class
  async bulkAssign(foundationClassId: number, memberIds: number[]) {
    const foundationClass = await this.prisma.foundationClass.findUnique({
      where: { id: foundationClassId },
    });
    if (!foundationClass) throw new NotFoundException(`Foundation class #${foundationClassId} not found`);

    const results = await Promise.all(
      memberIds.map((memberId) =>
        this.assignMember({ memberId, foundationClassId }).catch((err) => ({
          memberId,
          error: err.message,
        })),
      ),
    );

    return {
      assigned: results.filter((r: any) => !r.error).length,
      failed: results.filter((r: any) => r.error),
    };
  }

  // List members with NO active foundation class assignment (children, youth, unassigned)
  async listMembersWithoutClass() {
    const assignedMemberIds = await this.prisma.foundationClassMember
      .findMany({ where: { isActive: true }, select: { memberId: true } })
      .then((rows) => rows.map((r) => r.memberId));

    return this.prisma.member.findMany({
      where: { id: { notIn: assignedMemberIds } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
