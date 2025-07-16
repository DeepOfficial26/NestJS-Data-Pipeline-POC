"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const mongoose_1 = require("@nestjs/mongoose");
const typeorm_1 = require("@nestjs/typeorm");
const data_migration_service_1 = require("./data-migration.service");
const data_migration_controller_1 = require("./data-migration.controller");
const migration_processor_1 = require("./migration.processor");
const post_schema_1 = require("../data-ingestion/schemas/post.schema");
const migrated_post_entity_1 = require("./entities/migrated-post.entity");
let DataMigrationModule = class DataMigrationModule {
};
exports.DataMigrationModule = DataMigrationModule;
exports.DataMigrationModule = DataMigrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'migration',
            }),
            mongoose_1.MongooseModule.forFeature([{ name: post_schema_1.Post.name, schema: post_schema_1.PostSchema }]),
            typeorm_1.TypeOrmModule.forFeature([migrated_post_entity_1.MigratedPost]),
        ],
        controllers: [data_migration_controller_1.DataMigrationController],
        providers: [data_migration_service_1.DataMigrationService, migration_processor_1.MigrationProcessor],
        exports: [data_migration_service_1.DataMigrationService],
    })
], DataMigrationModule);
//# sourceMappingURL=data-migration.module.js.map