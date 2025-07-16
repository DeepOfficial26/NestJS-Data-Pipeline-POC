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
var DataIngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIngestionService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const post_schema_1 = require("./schemas/post.schema");
let DataIngestionService = DataIngestionService_1 = class DataIngestionService {
    constructor(postModel, httpService) {
        this.postModel = postModel;
        this.httpService = httpService;
        this.logger = new common_1.Logger(DataIngestionService_1.name);
        this.API_URL = 'https://jsonplaceholder.typicode.com/posts';
    }
    async handleCron() {
        this.logger.log('Scheduled data ingestion started');
        try {
            await this.ingestData();
            this.logger.log('Scheduled data ingestion completed successfully');
        }
        catch (error) {
            this.logger.error('Scheduled data ingestion failed', error);
        }
    }
    async ingestData() {
        try {
            this.logger.log('Starting data ingestion from JSONPlaceholder API');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.API_URL));
            const posts = response.data;
            this.logger.log(`Fetched ${posts.length} posts from API`);
            let savedCount = 0;
            let duplicateCount = 0;
            for (const postData of posts) {
                try {
                    const existingPost = await this.postModel.findOne({
                        externalId: postData.id,
                    });
                    if (existingPost) {
                        duplicateCount++;
                        this.logger.debug(`Duplicate post found: ${postData.id}`);
                        continue;
                    }
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
                }
                catch (error) {
                    this.logger.error(`Error processing post ${postData.id}:`, error);
                }
            }
            this.logger.log(`Data ingestion completed. Saved: ${savedCount}, Duplicates: ${duplicateCount}`);
        }
        catch (error) {
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
        }
        catch (error) {
            this.logger.error('Error getting ingestion stats:', error);
            throw error;
        }
    }
};
exports.DataIngestionService = DataIngestionService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_9_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataIngestionService.prototype, "handleCron", null);
exports.DataIngestionService = DataIngestionService = DataIngestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService])
], DataIngestionService);
//# sourceMappingURL=data-ingestion.service.js.map