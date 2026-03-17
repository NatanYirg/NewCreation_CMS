import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoundationClassesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.foundationClass.create({
      data,
    });
  }

  findAll() {
    return this.prisma.foundationClass.findMany({
      include: {
        members: true,
        leaders: true,
        teachers: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.foundationClass.findUnique({
      where: { id },
      include: {
        members: true,
        leaders: true,
        teachers: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.foundationClass.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.foundationClass.delete({
      where: { id },
    });
  }
}