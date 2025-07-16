import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataMigrationService } from './data-migration.service';
import { DataMigrationController } from './data-migration.controller';
import { MigrationProcessor } from './migration.processor';
import { Post, PostSchema } from '../data-ingestion/schemas/post.schema';
import { MigratedPost } from './entities/migrated-post.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'migration',
    }),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    TypeOrmModule.forFeature([MigratedPost]),
  ],
  controllers: [DataMigrationController],
  providers: [DataMigrationService, MigrationProcessor],
  exports: [DataMigrationService],
})
export class DataMigrationModule {}