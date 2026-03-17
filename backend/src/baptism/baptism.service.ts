import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BaptismService {
  constructor(private prisma: PrismaService) {}

  // --- Baptism Rounds ---

  async createRound(data: { name: string; date: string; notes?: string }) {
    return this.prisma.baptismRound.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        notes: data.notes,
      },
    });
  }

  findAllRounds() {
    return this.prisma.baptismRound.findMany({
      include: { members: { include: { member: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async findRound(id: number) {
    const round = await this.prisma.baptismRound.findUnique({
      where: { id },
      include: { members: { include: { member: true } } },
    });
    if (!round) throw new NotFoundException(`Baptism round #${id} not found`);
    return round;
  }

  async updateRound(id: number, data: { name?: string; date?: string; notes?: string }) {
    await this.findRound(id);
    return this.prisma.baptismRound.update({
      where: { id },
      data: {
        name: data.name,
        date: data.date ? new Date(data.date) : undefined,
        notes: data.notes,
      },
    });
  }

  async deleteRound(id: number) {
    await this.findRound(id);
    return this.prisma.baptismRound.delete({ where: { id } });
  }

  // --- Add/Remove members from a round ---

  async addMemberToRound(roundId: number, memberId: number) {
    const round = await this.prisma.baptismRound.findUnique({ where: { id: roundId } });
    if (!round) throw new NotFoundException(`Baptism round #${roundId} not found`);

    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException(`Member #${memberId} not found`);

    const existing = await this.prisma.baptismMember.findFirst({
      where: { baptismRoundId: roundId, memberId },
    });
    if (existing) throw new BadRequestException('Member is already in this baptism round');

    return this.prisma.baptismMember.create({
      data: { baptismRoundId: roundId, memberId },
    });
  }

  async removeMemberFromRound(roundId: number, memberId: number) {
    const record = await this.prisma.baptismMember.findFirst({
      where: { baptismRoundId: roundId, memberId },
    });
    if (!record) throw new NotFoundException('Member is not in this baptism round');
    return this.prisma.baptismMember.delete({ where: { id: record.id } });
  }

  // --- Get member's baptism history ---

  async getMemberBaptisms(memberId: number) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException(`Member #${memberId} not found`);

    return this.prisma.baptismMember.findMany({
      where: { memberId },
      include: { baptismRound: true },
      orderBy: { baptizedAt: 'desc' },
    });
  }

  // --- Get members baptized in a specific round ---

  async getMembersInRound(roundId: number) {
    const round = await this.findRound(roundId);
    return round.members;
  }

  // --- Statistics ---

  async getRoundStats(roundId: number) {
    const round = await this.findRound(roundId);
    return {
      roundId,
      roundName: round.name,
      date: round.date,
      totalBaptized: round.members.length,
      members: round.members.map((bm) => ({
        memberId: bm.memberId,
        firstName: bm.member.firstName,
        lastName: bm.member.lastName,
        baptizedAt: bm.baptizedAt,
      })),
    };
  }

  async getAllRoundsStats() {
    const rounds = await this.prisma.baptismRound.findMany({
      include: { members: true },
      orderBy: { date: 'desc' },
    });
    return rounds.map((r) => ({
      roundId: r.id,
      roundName: r.name,
      date: r.date,
      totalBaptized: r.members.length,
    }));
  }
}
