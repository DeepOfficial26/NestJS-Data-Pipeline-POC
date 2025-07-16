import { Injectable, Logger } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion/data-ingestion.service';
import { DataMigrationService } from './data-migration/data-migration.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly dataIngestionService: DataIngestionService,
    private readonly dataMigrationService: DataMigrationService,
  ) {}

  getHello(): string {
    return 'NestJS Data Pipeline POC - Welcome to the data ingestion and migration system!';
  }

  async triggerManualIngestion() {
    try {
      this.logger.log('Manual ingestion triggered');
      await this.dataIngestionService.ingestData();
      return { message: 'Manual ingestion completed successfully' };
    } catch (error) {
      this.logger.error('Manual ingestion failed', error);
      throw error;
    }
  }

  async triggerManualMigration() {
    try {
      this.logger.log('Manual migration triggered');
      await this.dataMigrationService.processDataMigration();
      return { message: 'Manual migration completed successfully' };
    } catch (error) {
      this.logger.error('Manual migration failed', error);
      throw error;
    }
  }
}