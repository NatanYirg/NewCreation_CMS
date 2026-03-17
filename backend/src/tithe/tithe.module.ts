import { Module } from '@nestjs/common';
import { TitheController } from './tithe.controller';
import { TitheService } from './tithe.service';

@Module({
  controllers: [TitheController],
  providers: [TitheService],
})
export class TitheModule {}
