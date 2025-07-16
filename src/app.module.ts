import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
import { DataMigrationModule } from './data-migration/data-migration.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs-pipeline-poc'
    ),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'password',
      database: process.env.MYSQL_DATABASE || 'nestjs_pipeline_poc',
      autoLoadEntities: true,
      synchronize: true, // Only for development
       dropSchema: true, 
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
      },
    }),
    DataIngestionModule,
    DataMigrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}