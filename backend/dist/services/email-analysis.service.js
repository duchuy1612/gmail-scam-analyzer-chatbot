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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_analysis_entity_1 = require("../entities/email-analysis.entity");
let EmailAnalysisService = class EmailAnalysisService {
    constructor(emailAnalysisRepository) {
        this.emailAnalysisRepository = emailAnalysisRepository;
    }
    async createAnalysis(data) {
        const analysis = this.emailAnalysisRepository.create(data);
        return await this.emailAnalysisRepository.save(analysis);
    }
    async getAnalysesByUserId(userId) {
        return await this.emailAnalysisRepository.find({
            where: { userId },
            order: { analyzedAt: 'DESC' },
        });
    }
    async getAnalysisById(id) {
        return await this.emailAnalysisRepository.findOne({ where: { id } });
    }
    async getRecentAnalyses(limit = 10) {
        return await this.emailAnalysisRepository.find({
            order: { analyzedAt: 'DESC' },
            take: limit,
            relations: ['user'],
        });
    }
    async getScamAnalyses(userId) {
        const where = { isScam: true };
        if (userId) {
            where.userId = userId;
        }
        return await this.emailAnalysisRepository.find({
            where,
            order: { analyzedAt: 'DESC' },
            relations: ['user'],
        });
    }
    async getAnalysisStats(userId) {
        const baseQuery = this.emailAnalysisRepository.createQueryBuilder('analysis');
        if (userId) {
            baseQuery.where('analysis.userId = :userId', { userId });
        }
        const totalAnalyses = await baseQuery.getCount();
        const scamAnalyses = await baseQuery
            .andWhere('analysis.isScam = :isScam', { isScam: true })
            .getCount();
        const averageRiskScore = await baseQuery
            .select('AVG(analysis.riskScore)', 'avgRisk')
            .getRawOne();
        return {
            totalAnalyses,
            scamAnalyses,
            legitimateAnalyses: totalAnalyses - scamAnalyses,
            averageRiskScore: parseFloat(averageRiskScore.avgRisk) || 0,
            scamPercentage: totalAnalyses > 0 ? (scamAnalyses / totalAnalyses) * 100 : 0,
        };
    }
};
exports.EmailAnalysisService = EmailAnalysisService;
exports.EmailAnalysisService = EmailAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_analysis_entity_1.EmailAnalysis)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmailAnalysisService);
//# sourceMappingURL=email-analysis.service.js.map