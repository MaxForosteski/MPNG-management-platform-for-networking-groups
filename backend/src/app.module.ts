import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntentionModule } from './intention/intention.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [IntentionModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
