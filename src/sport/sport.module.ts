import { Module } from '@nestjs/common';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [SportController],
  providers: [SportService, PrismaService],
})
export class SportModule {}
