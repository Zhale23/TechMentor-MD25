import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMentorshipDto } from '../../dto/create-mentorship.dto';

@Injectable()
export class MentorshipsService {
  // In-memory mentorships (5 examples)
  private data: Array<any> = [
    {
      id: 10,
      title: 'Node.js Básico',
      description: 'Introducción a Node.js para principiantes',
      mentor_id: 2,
      slots: 5,
      price: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 11,
      title: 'Testing con Jest',
      description: 'Aprende a testear aplicaciones Node con Jest',
      mentor_id: 2,
      slots: 3,
      price: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 12,
      title: 'Bases de datos con TypeORM',
      description: 'Modela y consulta bases de datos con TypeORM',
      mentor_id: 4,
      slots: 6,
      price: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 13,
      title: 'Arquitectura de APIs REST',
      description: 'Buenas prácticas para construir APIs REST con Node/Nest',
      mentor_id: 5,
      slots: 4,
      price: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 14,
      title: 'Desarrollo Frontend para backend',
      description: 'Conecta tus APIs con un frontend simple',
      mentor_id: 6,
      slots: 8,
      price: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  private nextId = this.data.reduce((max, m) => Math.max(max, m.id), 0) + 1;

  findAll() {
    return this.data;
  }

  findOne(id: number) {
    const m = this.data.find((x) => x.id === id);
    if (!m) throw new NotFoundException(`Mentorship ${id} not found`);
    return m;
  }

  create(dto: CreateMentorshipDto) {
    const now = new Date().toISOString();
    const record = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description ?? null,
      mentor_id: dto.mentor_id,
      slots: dto.slots ?? 1,
      price: dto.price ?? 0,
      created_at: now,
      updated_at: now,
    };
    this.data.push(record);
    return record;
  }

  update(id: number, dto: Partial<CreateMentorshipDto>) {
    const m = this.findOne(id);
    Object.assign(m, dto, { updated_at: new Date().toISOString() });
    return m;
  }

  remove(id: number) {
    const idx = this.data.findIndex((x) => x.id === id);
    if (idx === -1) throw new NotFoundException(`Mentorship ${id} not found`);
    this.data.splice(idx, 1);
    return { deleted: true };
  }
}
