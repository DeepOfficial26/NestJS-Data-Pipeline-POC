import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Post, PostDocument } from './schemas/post.schema';
export declare class DataIngestionService {
    private postModel;
    private readonly httpService;
    private readonly logger;
    private readonly API_URL;
    constructor(postModel: Model<PostDocument>, httpService: HttpService);
    handleCron(): Promise<void>;
    ingestData(): Promise<void>;
    getIngestionStats(): Promise<{
        total: number;
        migrated: number;
        pending: number;
        lastIngestion: import("mongoose").Document<unknown, {}, PostDocument> & Post & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
}
