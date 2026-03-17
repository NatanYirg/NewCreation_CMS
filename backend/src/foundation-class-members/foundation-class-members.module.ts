import { Module } from '@nestjs/common';
import { FoundationClassMembersController } from './foundation-class-members.controller';
import { FoundationClassMembersService } from './foundation-class-members.service';

@Module({
  controllers: [FoundationClassMembersController],
  providers: [FoundationClassMembersService]
})
export class FoundationClassMembersModule {}
