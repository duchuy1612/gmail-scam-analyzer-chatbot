import { AppService } from './app.service';
import { UserService } from './services/user.service';
import { EmailAnalysisService } from './services/email-analysis.service';
export declare class AppController {
    private readonly appService;
    private readonly userService;
    private readonly emailAnalysisService;
    constructor(appService: AppService, userService: UserService, emailAnalysisService: EmailAnalysisService);
    getHello(): object;
    getDetailedHealth(): object;
    testDatabase(): Promise<{
        message: string;
        data: {
            totalUsers: number;
            analysisStats: any;
            timestamp: string;
        };
        error?: undefined;
        timestamp?: undefined;
    } | {
        message: string;
        error: any;
        timestamp: string;
        data?: undefined;
    }>;
}
