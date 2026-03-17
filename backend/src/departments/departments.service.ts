import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  // --- Department CRUD ---

  create(data: { name: string }) {
    return this.prisma.department.create({ data });
  }

  findAll() {
    return this.prisma.department.findMany({
      include: { members: { include: { member: true } }, leaders: { include: { member: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const dept = await this.prisma.department.findUnique({
      where: { id },
      include: { members: { include: { member: true } }, leaders: { include: { member: true } } },
    });
    if (!dept) throw new NotFoundException(`Department #${id} not found`);
    return dept;
  }

  update(id: number, data: { name: string }) {
    return this.prisma.department.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.department.delete({ where: { id } });
  }

  // --- Members ---

  async assignMember(departmentId: number, memberId: number) {
    const existing = await this.prisma.departmentMember.findFirst({
      where: { departmentId, memberId },
    });
    if (existing) throw new BadRequestException('Member is already in this department');
    return this.prisma.departmentMember.create({ data: { departmentId, memberId } });
  }

  async removeMember(departmentId: number, memberId: number) {
    const record = await this.prisma.departmentMember.findFirst({
      where: { departmentId, memberId },
    });
    if (!record) throw new NotFoundException('Member is not in this department');
    return this.prisma.departmentMember.delete({ where: { id: record.id } });
  }

  listMembers(departmentId: number) {
    return this.prisma.departmentMember.findMany({
      where: { departmentId },
      include: { member: true },
    });
  }

  // --- Leaders ---

  async assignLeader(departmentId: number, memberId: number) {
    const existing = await this.prisma.departmentLeader.findFirst({
      where: { departmentId, memberId },
    });
    if (existing) throw new BadRequestException('Member is already a leader in this department');
    return this.prisma.departmentLeader.create({ data: { departmentId, memberId } });
  }

  async removeLeader(departmentId: number, memberId: number) {
    const record = await this.prisma.departmentLeader.findFirst({
      where: { departmentId, memberId },
    });
    if (!record) throw new NotFoundException('Leader not found in this department');
    return this.prisma.departmentLeader.delete({ where: { id: record.id } });
  }

  listLeaders(departmentId: number) {
    return this.prisma.departmentLeader.findMany({
      where: { departmentId },
      include: { member: true },
    });
  }

  // --- Member's departments ---

  getMemberDepartments(memberId: number) {
    return this.prisma.departmentMember.findMany({
      where: { memberId },
      include: { department: true },
    });
  }
}
