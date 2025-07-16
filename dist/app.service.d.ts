import { DataIngestionService } from './data-ingestion/data-ingestion.service';
import { DataMigrationService } from './data-migration/data-migration.service';
export declare class AppService {
    private readonly dataIngestionService;
    private readonly dataMigrationService;
    private readonly logger;
    constructor(dataIngestionService: DataIngestionService, dataMigrationService: DataMigrationService);
    getHello(): string;
    triggerManualIngestion(): Promise<{
        message: string;
    }>;
    triggerManualMigration(): Promise<{
        message: string;
    }>;
}
