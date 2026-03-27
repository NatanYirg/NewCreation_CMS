import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ClassDto { name: string; level: number; }

@Injectable()
export class FoundationClassesService {
  constructor(private prisma: PrismaService) {}

  create(data: ClassDto) {
    return this.prisma.foundationClass.create({ data });
  }

  findAll() {
    return this.prisma.foundationClass.findMany({
      include: { members: true, leaders: true, teachers: true },
    });
  }

  async findOne(id: number) {
    const cls = await this.prisma.foundationClass.findUnique({
      where: { id },
      include: { members: true, leaders: true, teachers: true },
    });
    if (!cls) throw new NotFoundException(`Foundation class #${id} not found`);
    return cls;
  }

  update(id: number, data: Partial<ClassDto>) {
    return this.prisma.foundationClass.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.foundationClass.delete({ where: { id } });
  }
}
