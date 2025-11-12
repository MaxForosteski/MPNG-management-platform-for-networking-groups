import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntentionDto } from './dto/create-intention.dto';

@Injectable()
export class IntentionService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateIntentionDto) {
        return this.prisma.intention.create({ data });
    }

    async findAll() {
        return this.prisma.intention.findMany({ orderBy: { createdAt: 'desc' } });
    }
}
