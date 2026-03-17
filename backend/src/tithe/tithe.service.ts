import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TitheType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TitheService {
  constructor(private prisma: PrismaService) {}

  // --- Record tithe ---

  async recordTithe(data: {
    amount: number;
    type: TitheType;
    name?: string;
    email?: string;
    phone?: string;
    memberId?: number;
    foundationClassId?: number;
    date: string;
    notes?: string;
  }) {
    if (data.amount <= 0) throw new BadRequestException('Amount must be greater than 0');

    // Validate member if provided
    if (data.memberId) {
      const member = await this.prisma.member.findUnique({ where: { id: data.memberId } });
      if (!member) throw new NotFoundException(`Member #${data.memberId} not found`);
    }

    // Validate foundation class if provided
    if (data.foundationClassId) {
      const cls = await this.prisma.foundationClass.findUnique({
        where: { id: data.foundationClassId },
      });
      if (!cls) throw new NotFoundException(`Foundation class #${data.foundationClassId} not found`);
    }

    // For NAMED type, require at least name or memberId
    if (data.type === TitheType.NAMED && !data.name && !data.memberId) {
      throw new BadRequestException('For NAMED tithes, provide either name or memberId');
    }

    return this.prisma.tithe.create({
      data: {
        amount: data.amount,
        type: data.type,
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        memberId: data.memberId || null,
        foundationClassId: data.foundationClassId || null,
        date: new Date(data.date),
        notes: data.notes,
      },
      include: { member: true, foundationClass: true },
    });
  }

  // --- Get all tithes ---

  findAll() {
    return this.prisma.tithe.findMany({
      include: { member: true },
      orderBy: { date: 'desc' },
    });
  }

  // --- Get tithe by ID ---

  async findOne(id: number) {
    const tithe = await this.prisma.tithe.findUnique({
      where: { id },
      include: { member: true },
    });
    if (!tithe) throw new NotFoundException(`Tithe #${id} not found`);
    return tithe;
  }

  // --- Delete tithe ---

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.tithe.delete({ where: { id } });
  }

  // --- Member tithe history ---

  async getMemberTithes(memberId: number) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException(`Member #${memberId} not found`);

    return this.prisma.tithe.findMany({
      where: { memberId },
      orderBy: { date: 'desc' },
    });
  }

  // --- Analytics ---

  async getTithesByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.prisma.tithe.findMany({
      where: {
        date: { gte: start, lte: end },
      },
      include: { member: true },
      orderBy: { date: 'desc' },
    });
  }

  async getMonthlyTotal(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const tithes = await this.prisma.tithe.findMany({
      where: {
        date: { gte: start, lte: end },
      },
    });

    const total = tithes.reduce((sum, t) => sum + Number(t.amount), 0);
    const named = tithes.filter((t) => t.type === TitheType.NAMED).reduce((sum, t) => sum + Number(t.amount), 0);
    const anonymous = tithes.filter((t) => t.type === TitheType.ANONYMOUS).reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      year,
      month,
      total,
      named,
      anonymous,
      count: tithes.length,
    };
  }

  async getYearlyTotal(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const tithes = await this.prisma.tithe.findMany({
      where: {
        date: { gte: start, lte: end },
      },
    });

    const total = tithes.reduce((sum, t) => sum + Number(t.amount), 0);
    const named = tithes.filter((t) => t.type === TitheType.NAMED).reduce((sum, t) => sum + Number(t.amount), 0);
    const anonymous = tithes.filter((t) => t.type === TitheType.ANONYMOUS).reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      year,
      total,
      named,
      anonymous,
      count: tithes.length,
    };
  }

  async getAllTimeStats() {
    const tithes = await this.prisma.tithe.findMany();

    const total = tithes.reduce((sum, t) => sum + Number(t.amount), 0);
    const named = tithes.filter((t) => t.type === TitheType.NAMED).reduce((sum, t) => sum + Number(t.amount), 0);
    const anonymous = tithes.filter((t) => t.type === TitheType.ANONYMOUS).reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      total,
      named,
      anonymous,
      count: tithes.length,
    };
  }

  async getTopContributors(limit: number = 10) {
    const tithes = await this.prisma.tithe.findMany({
      where: { type: TitheType.NAMED },
      include: { member: true },
    });

    const contributors = new Map<string, { name: string; total: number }>();
    tithes.forEach((t) => {
      const key = t.memberId ? `member_${t.memberId}` : `manual_${t.name}`;
      const name = t.member ? `${t.member.firstName} ${t.member.lastName}` : t.name || 'Unknown';
      const existing = contributors.get(key) || { name, total: 0 };
      existing.total += Number(t.amount);
      contributors.set(key, existing);
    });

    return Array.from(contributors.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  // --- Get tithes by foundation class ---

  async getTithesByFoundationClass(foundationClassId: number) {
    const cls = await this.prisma.foundationClass.findUnique({
      where: { id: foundationClassId },
    });
    if (!cls) throw new NotFoundException(`Foundation class #${foundationClassId} not found`);

    return this.prisma.tithe.findMany({
      where: { foundationClassId },
      include: { member: true, foundationClass: true },
      orderBy: { date: 'desc' },
    });
  }

  async getFoundationClassStats(foundationClassId: number) {
    const tithes = await this.getTithesByFoundationClass(foundationClassId);
    const total = tithes.reduce((sum, t) => sum + Number(t.amount), 0);
    const named = tithes.filter((t) => t.type === TitheType.NAMED).reduce((sum, t) => sum + Number(t.amount), 0);
    const anonymous = tithes.filter((t) => t.type === TitheType.ANONYMOUS).reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      foundationClassId,
      total,
      named,
      anonymous,
      count: tithes.length,
      tithes,
    };
  }
}