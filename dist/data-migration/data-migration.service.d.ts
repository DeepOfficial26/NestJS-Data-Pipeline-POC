import { Queue } from 'bull';
import { Model } from 'mongoose';
import { PostDocument } from '../data-ingestion/schemas/post.schema';
export declare class DataMigrationService {
    private migrationQueue;
    private postModel;
    private readonly logger;
    constructor(migrationQueue: Queue, postModel: Model<PostDocument>);
    handleCron(): Promise<void>;
    processDataMigration(): Promise<void>;
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
}
