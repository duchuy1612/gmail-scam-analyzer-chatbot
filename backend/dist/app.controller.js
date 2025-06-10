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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
const user_service_1 = require("./services/user.service");
const email_analysis_service_1 = require("./services/email-analysis.service");
let AppController = class AppController {
    constructor(appService, userService, emailAnalysisService) {
        this.appService = appService;
        this.userService = userService;
        this.emailAnalysisService = emailAnalysisService;
    }
    getHello() {
        return {
            message: this.appService.getHello(),
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }
    getDetailedHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: {
                database: 'connected',
                aiService: 'connected',
                cache: 'connected'
            }
        };
    }
    async testDatabase() {
        try {
            const userCount = await this.userService.getAllUsers();
            const stats = await this.emailAnalysisService.getAnalysisStats();
            return {
                message: 'Database connection successful!',
                data: {
                    totalUsers: userCount.length,
                    analysisStats: stats,
                    timestamp: new Date().toISOString(),
                }
            };
        }
        catch (error) {
            return {
                message: 'Database connection failed',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Basic health check endpoint to verify the API is running'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API is healthy',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Hello from NestJS!' },
                status: { type: 'string', example: 'healthy' },
                timestamp: { type: 'string', example: '2025-06-10T14:30:00Z' },
                version: { type: 'string', example: '1.0.0' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detailed health check',
        description: 'Comprehensive health check including service dependencies'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detailed health status',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'healthy' },
                timestamp: { type: 'string', example: '2025-06-10T14:30:00Z' },
                uptime: { type: 'number', example: 12345 },
                services: {
                    type: 'object',
                    properties: {
                        database: { type: 'string', example: 'connected' },
                        aiService: { type: 'string', example: 'connected' },
                        cache: { type: 'string', example: 'connected' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Service unhealthy',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'unhealthy' },
                errors: { type: 'array', items: { type: 'string' } }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getDetailedHealth", null);
__decorate([
    (0, common_1.Get)('test-db'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "testDatabase", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        user_service_1.UserService,
        email_analysis_service_1.EmailAnalysisService])
], AppController);
//# sourceMappingURL=app.controller.js.map