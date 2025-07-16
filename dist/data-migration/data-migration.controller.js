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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationController = void 0;
const common_1 = require("@nestjs/common");
const data_migration_service_1 = require("./data-migration.service");
let DataMigrationController = class DataMigrationController {
    constructor(dataMigrationService) {
        this.dataMigrationService = dataMigrationService;
    }
    async getMigrationStats() {
        return this.dataMigrationService.getMigrationStats();
    }
    async getQueueJobs() {
        return this.dataMigrationService.getQueueJobs();
    }
    async triggerMigration() {
        await this.dataMigrationService.processDataMigration();
        return { message: 'Data migration triggered successfully' };
    }
};
exports.DataMigrationController = DataMigrationController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getMigrationStats", null);
__decorate([
    (0, common_1.Get)('queue-jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getQueueJobs", null);
__decorate([
    (0, common_1.Post)('trigger'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "triggerMigration", null);
exports.DataMigrationController = DataMigrationController = __decorate([
    (0, common_1.Controller)('data-migration'),
    __metadata("design:paramtypes", [data_migration_service_1.DataMigrationService])
], DataMigrationController);
//# sourceMappingURL=data-migration.controller.js.map