import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMentorshipDto } from '../../dto/create-mentorship.dto';
import { Mentorship } from '../../entities/mentorship.entity';

@Injectable()
export class MentorshipsService {
  constructor(
    @InjectRepository(Mentorship)
    private readonly repo: Repository<Mentorship>,
  ) {}

  async findAll(): Promise<Mentorship[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Mentorship> {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException(`Mentorship ${id} not found`);
    return m;
  }

  async create(dto: CreateMentorshipDto): Promise<Mentorship> {
    const record = this.repo.create({
      title: dto.title,
      description: dto.description ?? undefined,
      mentor_id: dto.mentor_id,
      slots: dto.slots ?? 1,
      price: dto.price ?? 0,
    });
    return await this.repo.save(record);
  }

  async update(
    id: number,
    dto: Partial<CreateMentorshipDto>,
  ): Promise<Mentorship> {
    const m = await this.findOne(id);
    Object.assign(m, dto);
    return this.repo.save(m);
  }

  async remove(id: number) {
    const m = await this.findOne(id);
    await this.repo.remove(m);
    return { deleted: true };
  }
}
