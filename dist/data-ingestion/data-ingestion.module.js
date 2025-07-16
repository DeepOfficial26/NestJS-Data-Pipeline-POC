"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIngestionModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const data_ingestion_service_1 = require("./data-ingestion.service");
const data_ingestion_controller_1 = require("./data-ingestion.controller");
const post_schema_1 = require("./schemas/post.schema");
let DataIngestionModule = class DataIngestionModule {
};
exports.DataIngestionModule = DataIngestionModule;
exports.DataIngestionModule = DataIngestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: post_schema_1.Post.name, schema: post_schema_1.PostSchema }]),
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5,
            }),
        ],
        controllers: [data_ingestion_controller_1.DataIngestionController],
        providers: [data_ingestion_service_1.DataIngestionService],
        exports: [data_ingestion_service_1.DataIngestionService],
    })
], DataIngestionModule);
//# sourceMappingURL=data-ingestion.module.js.map