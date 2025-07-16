import { DataIngestionService } from './data-ingestion.service';
export declare class DataIngestionController {
    private readonly dataIngestionService;
    constructor(dataIngestionService: DataIngestionService);
    getIngestionStats(): Promise<{
        total: number;
        migrated: number;
        pending: number;
        lastIngestion: import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument> & import("./schemas/post.schema").Post & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    triggerIngestion(): Promise<{
        message: string;
    }>;
}
