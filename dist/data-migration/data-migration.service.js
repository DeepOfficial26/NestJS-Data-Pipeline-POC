"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DataMigrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bull_1 = require("@nestjs/bull");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("../data-ingestion/schemas/post.schema");
let DataMigrationService = DataMigrationService_1 = class DataMigrationService {
    constructor(migrationQueue, postModel) {
        this.migrationQueue = migrationQueue;
        this.postModel = postModel;
        this.logger = new common_1.Logger(DataMigrationService_1.name);
    }
    async handleCron() {
        this.logger.log('Scheduled data migration started');
        try {
            await this.processDataMigration();
            this.logger.log('Scheduled data migration completed successfully');
        }
        catch (error) {
            this.logger.error('Scheduled data migration failed', error);
        }
    }
    async processDataMigration() {
        try {
            this.logger.log('Starting data migration process');
            const unmigrated = await this.postModel.find({ migrated: false });
            if (unmigrated.length === 0) {
                this.logger.log('No posts to migrate');
                return;
            }
            this.logger.log(`Found ${unmigrated.length} posts to migrate`);
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            this.logger.error('Error getting queue jobs:', error);
            throw error;
        }
    }
};
exports.DataMigrationService = DataMigrationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_7_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataMigrationService.prototype, "handleCron", null);
exports.DataMigrationService = DataMigrationService = DataMigrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('migration')),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [Object, mongoose_2.Model])
], DataMigrationService);
//# sourceMappingURL=data-migration.service.js.map