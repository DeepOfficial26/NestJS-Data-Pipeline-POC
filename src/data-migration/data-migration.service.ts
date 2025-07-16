import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../data-ingestion/schemas/post.schema';

@Injectable()
export class DataMigrationService {
  private readonly logger = new Logger(DataMigrationService.name);

  constructor(
    @InjectQueue('migration') private migrationQueue: Queue,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  @Cron(CronExpression.EVERY_7_HOURS)
  async handleCron() {
    this.logger.log('Scheduled data migration started');
    try {
      await this.processDataMigration();
      this.logger.log('Scheduled data migration completed successfully');
    } catch (error) {
      this.logger.error('Scheduled data migration failed', error);
    }
  }

  async processDataMigration(): Promise<void> {
    try {
      this.logger.log('Starting data migration process');
      
      // Find all non-migrated posts
      const unmigrated = await this.postModel.find({ migrated: false });
      
      if (unmigrated.length === 0) {
        this.logger.log('No posts to migrate');
        return;
      }

      this.logger.log(`Found ${unmigrated.length} posts to migrate`);

      // Add jobs to queue in batches
      const batchSize = 10;
      let processed = 0;

      for (let i = 0; i < unmigrated.length; i += batchSize) {
        const batch = unmigrated.slice(i, i + batchSize);
        
        for (const post of batch) {
          await this.migrationQueue.add('migrate-post', {
            postId: post._id.toString(),
            externalId: post.externalId,
            userId: post.userId,
            title: post.title,
            body: post.body,
            ingestedAt: post.ingestedAt,
          }, {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          });
        }
        
        processed += batch.length;
        this.logger.log(`Queued ${processed}/${unmigrated.length} posts for migration`);
      }

      this.logger.log('All posts queued for migration');
    } catch (error) {
      this.logger.error('Error in data migration process:', error);
      throw error;
    }
  }

  async getMigrationStats() {
    try {
      const queueStats = await this.migrationQueue.getJobCounts();
      const mongoStats = await this.postModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            migrated: {
              $sum: { $cond: [{ $eq: ['$migrated', true] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$migrated', false] }, 1, 0] }
            }
          }
        }
      ]);

      return {
        queue: queueStats,
        mongo: mongoStats[0] || { total: 0, migrated: 0, pending: 0 },
      };
    } catch (error) {
      this.logger.error('Error getting migration stats:', error);
      throw error;
    }
  }

  async getQueueJobs() {
    try {
      const waiting = await this.migrationQueue.getJobs(['waiting'], 0, 10);
      const active = await this.migrationQueue.getJobs(['active'], 0, 10);
      const completed = await this.migrationQueue.getJobs(['completed'], 0, 10);
      const failed = await this.migrationQueue.getJobs(['failed'], 0, 10);

      return {
        waiting: waiting.map(job => ({
          id: job.id,
          data: job.data,
          attempts: job.attemptsMade,
          timestamp: job.timestamp,
        })),
        active: active.map(job => ({
          id: job.id,
          data: job.data,
          attempts: job.attemptsMade,
          timestamp: job.timestamp,
        })),
        completed: completed.map(job => ({
          id: job.id,
          data: job.data,
          attempts: job.attemptsMade,
          timestamp: job.timestamp,
        })),
        failed: failed.map(job => ({
          id: job.id,
          data: job.data,
          attempts: job.attemptsMade,
          timestamp: job.timestamp,
          error: job.failedReason,
        })),
      };
    } catch (error) {
      this.logger.error('Error getting queue jobs:', error);
      throw error;
    }
  }
}