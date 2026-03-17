import { Module } from '@nestjs/common';
import { FoundationClassLeadersController } from './foundation-class-leaders.controller';
import { FoundationClassLeadersService } from './foundation-class-leaders.service';

@Module({
  controllers: [FoundationClassLeadersController],
  providers: [FoundationClassLeadersService],
})
export class FoundationClassLeadersModule {}
