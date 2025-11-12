import { Body, Controller, Get, Post } from '@nestjs/common';
import { IntentionService } from './intention.service';
import { CreateIntentionDto } from './dto/create-intention.dto';

@Controller('intention')
export class IntentionController {
    constructor(private readonly intentionService: IntentionService) {}

    @Post()
    create(@Body() data: CreateIntentionDto) {
        return this.intentionService.create(data);
    }

    @Get()
    findAll() {
        return this.intentionService.findAll();
    }
}
