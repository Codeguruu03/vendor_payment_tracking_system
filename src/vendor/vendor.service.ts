import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  create(data) {
    return this.prisma.vendor.create({ data });
  }

  findAll() {
    return this.prisma.vendor.findMany();
  }
}
