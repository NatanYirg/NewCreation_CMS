import { Module } from '@nestjs/common';
import { BaptismController } from './baptism.controller';
import { BaptismService } from './baptism.service';

@Module({
  controllers: [BaptismController],
  providers: [BaptismService],
})
export class BaptismModule {}
