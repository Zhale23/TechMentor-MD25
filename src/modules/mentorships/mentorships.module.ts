import { Module } from '@nestjs/common';
import { MentorshipsService } from './mentorships.service';
import { MentorshipsController } from './mentorships.controller';

@Module({
  controllers: [MentorshipsController],
  providers: [MentorshipsService],
  exports: [MentorshipsService],
})
export class MentorshipsModule {}