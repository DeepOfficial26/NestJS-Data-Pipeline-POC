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
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const data_ingestion_service_1 = require("./data-ingestion/data-ingestion.service");
const data_migration_service_1 = require("./data-migration/data-migration.service");
let AppService = AppService_1 = class AppService {
    constructor(dataIngestionService, dataMigrationService) {
        this.dataIngestionService = dataIngestionService;
        this.dataMigrationService = dataMigrationService;
        this.logger = new common_1.Logger(AppService_1.name);
    }
    getHello() {
        return 'NestJS Data Pipeline POC - Welcome to the data ingestion and migration system!';
    }
    async triggerManualIngestion() {
        try {
            this.logger.log('Manual ingestion triggered');
            await this.dataIngestionService.ingestData();
            return { message: 'Manual ingestion completed successfully' };
        }
        catch (error) {
            this.logger.error('Manual ingestion failed', error);
            throw error;
        }
    }
    async triggerManualMigration() {
        try {
            this.logger.log('Manual migration triggered');
            await this.dataMigrationService.processDataMigration();
            return { message: 'Manual migration completed successfully' };
        }
        catch (error) {
            this.logger.error('Manual migration failed', error);
            throw error;
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [data_ingestion_service_1.DataIngestionService,
        data_migration_service_1.DataMigrationService])
], AppService);
//# sourceMappingURL=app.service.js.map