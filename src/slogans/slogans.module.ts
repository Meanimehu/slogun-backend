import { Module } from '@nestjs/common';
import { SlogansController } from './slogans.controller';
import { SlogansService } from './slogans.service';

@Module({
  controllers: [SlogansController],
  providers: [SlogansService]
})
export class SlogansModule {}
