import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RelationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FamilyService {
  constructor(private prisma: PrismaService) {}

  // --- Create relationship ---

  async createRelationship(
    memberId1: number,
    memberId2: number,
    relationType: RelationType,
  ) {
    // Verify both members exist
    const member1 = await this.prisma.member.findUnique({ where: { id: memberId1 } });
    const member2 = await this.prisma.member.findUnique({ where: { id: memberId2 } });
    if (!member1 || !member2) throw new NotFoundException('One or both members not found');

    if (memberId1 === memberId2) throw new BadRequestException('Cannot create relationship with same member');

    // Check if relationship already exists (in either direction)
    const existing = await this.prisma.familyRelationship.findFirst({
      where: {
        OR: [
          { memberId1, memberId2 },
          { memberId1: memberId2, memberId2: memberId1 },
        ],
      },
    });
    if (existing) throw new BadRequestException('Relationship already exists between these members');

    return this.prisma.familyRelationship.create({
      data: { memberId1, memberId2, relationType },
      include: { member1: true, member2: true },
    });
  }

  // --- Get member's family ---

  async getMemberFamily(memberId: number) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException(`Member #${memberId} not found`);

    const relationships = await this.prisma.familyRelationship.findMany({
      where: {
        OR: [{ memberId1: memberId }, { memberId2: memberId }],
      },
      include: { member1: true, member2: true },
    });

    // Normalize: always return the "other" member and the relationship type
    return relationships.map((rel) => {
      const isFirst = rel.memberId1 === memberId;
      const otherMember = isFirst ? rel.member2 : rel.member1;
      return {
        relationshipId: rel.id,
        relationType: rel.relationType,
        memberId: otherMember.id,
        firstName: otherMember.firstName,
        lastName: otherMember.lastName,
        phone: otherMember.phone,
        email: otherMember.email,
      };
    });
  }

  // --- Get specific relationships ---

  async getSpouse(memberId: number) {
    const family = await this.getMemberFamily(memberId);
    const spouse = family.find((f) => f.relationType === RelationType.SPOUSE);
    return spouse || null;
  }

  async getChildren(memberId: number) {
    const family = await this.getMemberFamily(memberId);
    return family.filter((f) => f.relationType === RelationType.CHILD);
  }

  async getParents(memberId: number) {
    const family = await this.getMemberFamily(memberId);
    return family.filter((f) => f.relationType === RelationType.PARENT);
  }

  async getSiblings(memberId: number) {
    const family = await this.getMemberFamily(memberId);
    return family.filter((f) => f.relationType === RelationType.SIBLING);
  }

  // --- Delete relationship ---

  async deleteRelationship(relationshipId: number) {
    const rel = await this.prisma.familyRelationship.findUnique({ where: { id: relationshipId } });
    if (!rel) throw new NotFoundException(`Relationship #${relationshipId} not found`);
    return this.prisma.familyRelationship.delete({ where: { id: relationshipId } });
  }

  // --- Statistics ---

  async getMarriedMembers() {
    const relationships = await this.prisma.familyRelationship.findMany({
      where: { relationType: RelationType.SPOUSE },
      include: { member1: true, member2: true },
    });
    return relationships.map((rel) => ({
      couple: [
        { id: rel.member1.id, name: `${rel.member1.firstName} ${rel.member1.lastName}` },
        { id: rel.member2.id, name: `${rel.member2.firstName} ${rel.member2.lastName}` },
      ],
      marriedSince: rel.createdAt,
    }));
  }

  async getUnmarriedMembers() {
    const allMembers = await this.prisma.member.findMany();
    const married = await this.prisma.familyRelationship.findMany({
      where: { relationType: RelationType.SPOUSE },
      select: { memberId1: true, memberId2: true },
    });

    const marriedIds = new Set<number>();
    married.forEach((m) => {
      marriedIds.add(m.memberId1);
      marriedIds.add(m.memberId2);
    });

    return allMembers
      .filter((m) => !marriedIds.has(m.id))
      .map((m) => ({ id: m.id, name: `${m.firstName} ${m.lastName}` }));
  }

  async getFamilies() {
    // Group members by family (connected components)
    const allMembers = await this.prisma.member.findMany();
    const relationships = await this.prisma.familyRelationship.findMany({
      include: { member1: true, member2: true },
    });

    const families: Map<number, Set<number>> = new Map();
    const visited = new Set<number>();

    const dfs = (memberId: number, familySet: Set<number>) => {
      if (visited.has(memberId)) return;
      visited.add(memberId);
      familySet.add(memberId);

      const related = relationships.filter(
        (r) => r.memberId1 === memberId || r.memberId2 === memberId,
      );
      related.forEach((r) => {
        const other = r.memberId1 === memberId ? r.memberId2 : r.memberId1;
        dfs(other, familySet);
      });
    };

    allMembers.forEach((member) => {
      if (!visited.has(member.id)) {
        const familySet = new Set<number>();
        dfs(member.id, familySet);
        if (familySet.size > 1) {
          families.set(member.id, familySet);
        }
      }
    });

    return Array.from(families.values()).map((familySet) =>
      allMembers
        .filter((m) => familySet.has(m.id))
        .map((m) => ({ id: m.id, name: `${m.firstName} ${m.lastName}` })),
    );
  }
}
