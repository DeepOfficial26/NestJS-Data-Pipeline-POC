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
var MigrationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const typeorm_1 = require("@nestjs/typeorm");
const mongoose_2 = require("mongoose");
const typeorm_2 = require("typeorm");
const post_schema_1 = require("../data-ingestion/schemas/post.schema");
const migrated_post_entity_1 = require("./entities/migrated-post.entity");
let MigrationProcessor = MigrationProcessor_1 = class MigrationProcessor {
    constructor(postModel, migratedPostRepository) {
        this.postModel = postModel;
        this.migratedPostRepository = migratedPostRepository;
        this.logger = new common_1.Logger(MigrationProcessor_1.name);
    }
    async handleMigration(job) {
        const { postId, externalId, userId, title, body, ingestedAt } = job.data;
        try {
            this.logger.log(`Processing migration for post: ${externalId}`);
            const existingMigratedPost = await this.migratedPostRepository.findOne({
                where: { externalId },
            });
            if (existingMigratedPost) {
                this.logger.warn(`Post ${externalId} already exists in MySQL`);
                await this.postModel.findByIdAndUpdate(postId, {
                    migrated: true,
                    migratedAt: new Date(),
                });
                return { status: 'duplicate', externalId };
            }
            const migratedPost = this.migratedPostRepository.create({
                externalId,
                userId,
                title,
                body,
                ingestedAt,
                migratedAt: new Date(),
            });
            await this.migratedPostRepository.save(migratedPost);
            await this.postModel.findByIdAndUpdate(postId, {
                migrated: true,
                migratedAt: new Date(),
            });
            this.logger.log(`Successfully migrated post: ${externalId}`);
            return { status: 'success', externalId };
        }
        catch (error) {
            this.logger.error(`Error migrating post ${externalId}:`, error);
            throw error;
        }
    }
};
exports.MigrationProcessor = MigrationProcessor;
__decorate([
    (0, bull_1.Process)('migrate-post'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MigrationProcessor.prototype, "handleMigration", null);
exports.MigrationProcessor = MigrationProcessor = MigrationProcessor_1 = __decorate([
    (0, bull_1.Processor)('migration'),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, typeorm_1.InjectRepository)(migrated_post_entity_1.MigratedPost)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        typeorm_2.Repository])
], MigrationProcessor);
//# sourceMappingURL=migration.processor.js.map