import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { DataIngestionService } from './data-ingestion.service';
import { DataIngestionController } from './data-ingestion.controller';
import { PostSchema, Post } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [DataIngestionController],
  providers: [DataIngestionService],
  exports: [DataIngestionService],
})
export class DataIngestionModule {}