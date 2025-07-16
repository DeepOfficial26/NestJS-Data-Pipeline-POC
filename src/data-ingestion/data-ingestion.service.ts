import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class DataIngestionService {
  private readonly logger = new Logger(DataIngestionService.name);
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/posts';

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_9_HOURS)
  async handleCron() {
    this.logger.log('Scheduled data ingestion started');
    try {
      await this.ingestData();
      this.logger.log('Scheduled data ingestion completed successfully');
    } catch (error) {
      this.logger.error('Scheduled data ingestion failed', error);
    }
  }

  async ingestData(): Promise<void> {
    try {
      this.logger.log('Starting data ingestion from JSONPlaceholder API');
      
      // Fetch data from API
      const response = await firstValueFrom(
        this.httpService.get(this.API_URL)
      );
      
      const posts = response.data;
      this.logger.log(`Fetched ${posts.length} posts from API`);

      // Process and store data
      let savedCount = 0;
      let duplicateCount = 0;

      for (const postData of posts) {
        try {
          // Check for duplicates
          const existingPost = await this.postModel.findOne({
            externalId: postData.id,
          });

          if (existingPost) {
            duplicateCount++;
            this.logger.debug(`Duplicate post found: ${postData.id}`);
            continue;
          }

          // Create new post
          const post = new this.postModel({
            externalId: postData.id,
            userId: postData.userId,
            title: postData.title,
            body: postData.body,
            ingestedAt: new Date(),
            migrated: false,
          });

          await post.save();
          savedCount++;
          this.logger.debug(`Saved post: ${postData.id}`);
        } catch (error) {
          this.logger.error(`Error processing post ${postData.id}:`, error);
        }
      }

      this.logger.log(
        `Data ingestion completed. Saved: ${savedCount}, Duplicates: ${duplicateCount}`
      );
    } catch (error) {
      this.logger.error('Data ingestion failed:', error);
      throw error;
    }
  }

  async getIngestionStats() {
    try {
      const total = await this.postModel.countDocuments();
      const migrated = await this.postModel.countDocuments({ migrated: true });
      const pending = await this.postModel.countDocuments({ migrated: false });

      return {
        total,
        migrated,
        pending,
        lastIngestion: await this.postModel
          .findOne()
          .sort({ ingestedAt: -1 })
          .select('ingestedAt'),
      };
    } catch (error) {
      this.logger.error('Error getting ingestion stats:', error);
      throw error;
    }
  }
}