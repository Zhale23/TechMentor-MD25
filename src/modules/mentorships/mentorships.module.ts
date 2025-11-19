import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorshipsService } from './mentorships.service';
import { MentorshipsController } from './mentorships.controller';
import { Mentorship } from '../../entities/mentorship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mentorship])],
  controllers: [MentorshipsController],
  providers: [MentorshipsService],
  exports: [MentorshipsService],
})
export class MentorshipsModule {}
