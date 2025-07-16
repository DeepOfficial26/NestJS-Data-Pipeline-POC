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
exports.DataIngestionController = void 0;
const common_1 = require("@nestjs/common");
const data_ingestion_service_1 = require("./data-ingestion.service");
let DataIngestionController = class DataIngestionController {
    constructor(dataIngestionService) {
        this.dataIngestionService = dataIngestionService;
    }
    async getIngestionStats() {
        return this.dataIngestionService.getIngestionStats();
    }
    async triggerIngestion() {
        await this.dataIngestionService.ingestData();
        return { message: 'Data ingestion triggered successfully' };
    }
};
exports.DataIngestionController = DataIngestionController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataIngestionController.prototype, "getIngestionStats", null);
__decorate([
    (0, common_1.Post)('trigger'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataIngestionController.prototype, "triggerIngestion", null);
exports.DataIngestionController = DataIngestionController = __decorate([
    (0, common_1.Controller)('data-ingestion'),
    __metadata("design:paramtypes", [data_ingestion_service_1.DataIngestionService])
], DataIngestionController);
//# sourceMappingURL=data-ingestion.controller.js.map