import { Controller, Get, Post } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';

@Controller('data-ingestion')
export class DataIngestionController {
  constructor(private readonly dataIngestionService: DataIngestionService) {}

  @Get('stats')
  async getIngestionStats() {
    return this.dataIngestionService.getIngestionStats();
  }

  @Post('trigger')
  async triggerIngestion() {
    await this.dataIngestionService.ingestData();
    return { message: 'Data ingestion triggered successfully' };
  }
}