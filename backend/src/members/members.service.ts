import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MemberStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMemberDto) {
    return this.prisma.member.create({ data: dto });
  }

  async findAll() {
    return this.prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
      include: { foundationClasses: { where: { isActive: true }, include: { foundationClass: true } } },
    });
  }

  async findOne(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        foundationClasses: { where: { isActive: true }, include: { foundationClass: true } },
        departmentMemberships: { include: { department: true } },
      },
    });
    if (!member) throw new NotFoundException(`Member #${id} not found`);
    return member;
  }

  async update(id: number, dto: UpdateMemberDto) {
    await this.findOne(id); // ensure exists
    return this.prisma.member.update({ where: { id }, data: dto });
  }

  async updateStatus(id: number, status: MemberStatus, inactiveReason?: string) {
    await this.findOne(id);
    if (status === MemberStatus.ACTIVE && inactiveReason) {
      throw new BadRequestException('inactiveReason should not be set for ACTIVE members');
    }
    if (status !== MemberStatus.ACTIVE && !inactiveReason) {
      throw new BadRequestException('inactiveReason is required when status is not ACTIVE');
    }
    return this.prisma.member.update({
      where: { id },
      data: { status, inactiveReason: status === MemberStatus.ACTIVE ? null : inactiveReason },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.member.delete({ where: { id } });
  }

  async findByStatus(status: MemberStatus) {
    return this.prisma.member.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }
}
