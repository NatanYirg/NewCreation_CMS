import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { RelationType } from '@prisma/client';
import { FamilyService } from './family.service';

@Controller('family')
export class FamilyController {
  constructor(private readonly service: FamilyService) {}

  // --- Create relationship ---

  @Post('relationships')
  createRelationship(
    @Body() body: { memberId1: number; memberId2: number; relationType: RelationType },
  ) {
    return this.service.createRelationship(body.memberId1, body.memberId2, body.relationType);
  }

  // --- Get member's family ---

  @Get('member/:memberId')
  getMemberFamily(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getMemberFamily(memberId);
  }

  @Get('member/:memberId/spouse')
  getSpouse(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getSpouse(memberId);
  }

  @Get('member/:memberId/children')
  getChildren(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getChildren(memberId);
  }

  @Get('member/:memberId/parents')
  getParents(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getParents(memberId);
  }

  @Get('member/:memberId/siblings')
  getSiblings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.service.getSiblings(memberId);
  }

  // --- Delete relationship ---

  @Delete('relationships/:id')
  deleteRelationship(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteRelationship(id);
  }

  // --- Statistics ---

  @Get('stats/married')
  getMarriedMembers() {
    return this.service.getMarriedMembers();
  }

  @Get('stats/unmarried')
  getUnmarriedMembers() {
    return this.service.getUnmarriedMembers();
  }

  @Get('stats/families')
  getFamilies() {
    return this.service.getFamilies();
  }
}
