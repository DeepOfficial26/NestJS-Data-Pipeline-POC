# NestJS Data Pipeline POC

A comprehensive proof of concept demonstrating a data ingestion and migration pipeline using NestJS, MongoDB, MySQL, Bull queues, and scheduled jobs.

## Features

- **Data Ingestion**: Scheduled consumption of JSONPlaceholder API every 10 minutes
- **MongoDB Storage**: Initial data storage with duplicate prevention
- **Bull Queue System**: Redis-backed queue for efficient data processing
- **MySQL Migration**: Background migration of processed data
- **Comprehensive Logging**: Detailed logging throughout the pipeline
- **Error Handling**: Robust error handling and retry mechanisms
- **Health Monitoring**: API endpoints for monitoring system health

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   JSONPlaceholder │    │    NestJS API   │    │    MongoDB      │
│      API          │───▶│   (Scheduled    │───▶│   (Initial      │
│                   │    │    Job)         │    │    Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Bull Queue    │
                       │   (Redis)       │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     MySQL       │
                       │   (Final        │
                       │    Storage)     │
                       └─────────────────┘
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- MySQL (running on localhost:3306)
- Redis (running on localhost:6379)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your databases:
   - MongoDB: Create database `nestjs-pipeline-poc`
   - MySQL: Create database `nestjs_pipeline_poc`
   - Redis: Ensure Redis server is running

4. Configure environment variables in `.env` file

5. Start the application:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Application health status

### Data Ingestion
- `GET /data-ingestion/stats` - Get ingestion statistics
- `POST /data-ingestion/trigger` - Manually trigger data ingestion

### Data Migration
- `GET /data-migration/stats` - Get migration statistics
- `GET /data-migration/queue-jobs` - Get queue job status
- `POST /data-migration/trigger` - Manually trigger data migration

### Manual Triggers
- `POST /trigger-ingestion` - Manually trigger data ingestion
- `POST /trigger-migration` - Manually trigger data migration

## Data Flow

1. **Scheduled Ingestion**: Every 10 minutes, the system fetches posts from JSONPlaceholder API
2. **Duplicate Prevention**: Checks for existing records before saving to MongoDB
3. **Queue Processing**: Non-migrated records are queued for migration
4. **Background Migration**: Bull processor migrates data from MongoDB to MySQL
5. **Status Tracking**: Updates migration status in MongoDB

## Monitoring

The system provides comprehensive monitoring through:
- Real-time queue statistics
- Database record counts
- Migration progress tracking
- Error logging and retry mechanisms

## Key Components

### DataIngestionService
- Scheduled cron job for API consumption
- Duplicate prevention logic
- MongoDB data storage

### DataMigrationService
- Queue management for migration jobs
- Batch processing for efficiency
- Statistics and monitoring

### MigrationProcessor
- Bull queue processor for background migration
- Retry logic with exponential backoff
- Error handling and logging

## Database Schema

### MongoDB (Initial Storage)
```javascript
{
  externalId: Number,
  userId: Number,
  title: String,
  body: String,
  ingestedAt: Date,
  migrated: Boolean,
  migratedAt: Date
}
```

### MySQL (Final Storage)
```sql
CREATE TABLE migrated_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  externalId INT UNIQUE,
  userId INT,
  title TEXT,
  body TEXT,
  ingestedAt DATETIME,
  migratedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Testing

Run the application and test the endpoints:

1. Check health: `GET http://localhost:3000/health`
2. Trigger ingestion: `POST http://localhost:3000/trigger-ingestion`
3. Check stats: `GET http://localhost:3000/data-ingestion/stats`
4. Trigger migration: `POST http://localhost:3000/trigger-migration`
5. Monitor queue: `GET http://localhost:3000/data-migration/queue-jobs`

## Error Handling

- API failures are logged and retried
- Database connection errors are handled gracefully
- Queue job failures trigger retry with exponential backoff
- Duplicate data is detected and handled appropriately

## Production Considerations

- Use connection pooling for databases
- Implement proper authentication and authorization
- Add rate limiting for API endpoints
- Use environment-specific configurations
- Implement proper monitoring and alerting
- Consider horizontal scaling for queue processing

## License

This project is for demonstration purposes only.
