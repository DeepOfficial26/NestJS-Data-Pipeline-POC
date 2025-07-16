import { Controller, Get, Post } from '@nestjs/common';
import { DataMigrationService } from './data-migration.service';

@Controller('data-migration')
export class DataMigrationController {
  constructor(private readonly dataMigrationService: DataMigrationService) {}

  @Get('stats')
  async getMigrationStats() {
    return this.dataMigrationService.getMigrationStats();
  }

  @Get('queue-jobs')
  async getQueueJobs() {
    return this.dataMigrationService.getQueueJobs();
  }

  @Post('trigger')
  async triggerMigration() {
    await this.dataMigrationService.processDataMigration();
    return { message: 'Data migration triggered successfully' };
  }
}