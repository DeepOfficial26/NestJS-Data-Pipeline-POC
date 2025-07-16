import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { Post, PostDocument } from '../data-ingestion/schemas/post.schema';
import { MigratedPost } from './entities/migrated-post.entity';

@Processor('migration')
export class MigrationProcessor {
  private readonly logger = new Logger(MigrationProcessor.name);

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectRepository(MigratedPost)
    private migratedPostRepository: Repository<MigratedPost>,
  ) {}

  @Process('migrate-post')
  async handleMigration(job: Job) {
    const { postId, externalId, userId, title, body, ingestedAt } = job.data;
    
    try {
      this.logger.log(`Processing migration for post: ${externalId}`);

      // Check if already migrated to MySQL
      const existingMigratedPost = await this.migratedPostRepository.findOne({
        where: { externalId },
      });

      if (existingMigratedPost) {
        this.logger.warn(`Post ${externalId} already exists in MySQL`);
        
        // Update MongoDB record to mark as migrated
        await this.postModel.findByIdAndUpdate(postId, {
          migrated: true,
          migratedAt: new Date(),
        });
        
        return { status: 'duplicate', externalId };
      }

      // Create new record in MySQL
      const migratedPost = this.migratedPostRepository.create({
        externalId,
        userId,
        title,
        body,
        ingestedAt,
        migratedAt: new Date(),
      });

      await this.migratedPostRepository.save(migratedPost);

      // Update MongoDB record to mark as migrated
      await this.postModel.findByIdAndUpdate(postId, {
        migrated: true,
        migratedAt: new Date(),
      });

      this.logger.log(`Successfully migrated post: ${externalId}`);
      return { status: 'success', externalId };
    } catch (error) {
      this.logger.error(`Error migrating post ${externalId}:`, error);
      throw error;
    }
  }
}