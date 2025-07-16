import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'NestJS Data Pipeline POC',
    };
  }

  @Post('trigger-ingestion')
  async triggerManualIngestion() {
    return this.appService.triggerManualIngestion();
  }

  @Post('trigger-migration')
  async triggerManualMigration() {
    return this.appService.triggerManualMigration();
  }
}