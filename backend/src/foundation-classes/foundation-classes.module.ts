import { Module } from '@nestjs/common';
import { FoundationClassesService } from './foundation-classes.service';
import { FoundationClassesController } from './foundation-classes.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FoundationClassesController],
  providers: [FoundationClassesService, PrismaService],
})
export class FoundationClassesModule {}