import { Module } from '@nestjs/common';
import { FoundationClassTeachersService } from './foundation-class-teachers.service';
import { FoundationClassTeachersController } from './foundation-class-teachers.controller';

@Module({
  providers: [FoundationClassTeachersService],
  controllers: [FoundationClassTeachersController]
})
export class FoundationClassTeachersModule {}
