import { Job } from 'bull';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { PostDocument } from '../data-ingestion/schemas/post.schema';
import { MigratedPost } from './entities/migrated-post.entity';
export declare class MigrationProcessor {
    private postModel;
    private migratedPostRepository;
    private readonly logger;
    constructor(postModel: Model<PostDocument>, migratedPostRepository: Repository<MigratedPost>);
    handleMigration(job: Job): Promise<{
        status: string;
        externalId: any;
    }>;
}
