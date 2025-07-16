import { DataMigrationService } from './data-migration.service';
export declare class DataMigrationController {
    private readonly dataMigrationService;
    constructor(dataMigrationService: DataMigrationService);
    getMigrationStats(): Promise<{
        queue: import("bull").JobCounts;
        mongo: any;
    }>;
    getQueueJobs(): Promise<{
        waiting: {
            id: import("bull").JobId;
            data: any;
            attempts: number;
            timestamp: number;
        }[];
        active: {
            id: import("bull").JobId;
            data: any;
            attempts: number;
            timestamp: number;
        }[];
        completed: {
            id: import("bull").JobId;
            data: any;
            attempts: number;
            timestamp: number;
        }[];
        failed: {
            id: import("bull").JobId;
            data: any;
            attempts: number;
            timestamp: number;
            error: string;
        }[];
    }>;
    triggerMigration(): Promise<{
        message: string;
    }>;
}
