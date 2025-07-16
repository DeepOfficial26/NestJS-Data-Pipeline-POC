import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
    };
    triggerManualIngestion(): Promise<{
        message: string;
    }>;
    triggerManualMigration(): Promise<{
        message: string;
    }>;
}
