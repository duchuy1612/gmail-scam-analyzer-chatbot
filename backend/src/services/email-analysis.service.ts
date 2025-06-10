import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAnalysis } from '../entities/email-analysis.entity';

export interface CreateEmailAnalysisData {
  userId: string;
  emailContent: string;
  emailSubject?: string;
  emailSender?: string;
  analysisResult: any;
  riskScore: number;
  isScam: boolean;
}

@Injectable()
export class EmailAnalysisService {
  constructor(
    @InjectRepository(EmailAnalysis)
    private emailAnalysisRepository: Repository<EmailAnalysis>,
  ) {}

  async createAnalysis(data: CreateEmailAnalysisData): Promise<EmailAnalysis> {
    const analysis = this.emailAnalysisRepository.create(data);
    return await this.emailAnalysisRepository.save(analysis);
  }

  async getAnalysesByUserId(userId: string): Promise<EmailAnalysis[]> {
    return await this.emailAnalysisRepository.find({
      where: { userId },
      order: { analyzedAt: 'DESC' },
    });
  }

  async getAnalysisById(id: string): Promise<EmailAnalysis | null> {
    return await this.emailAnalysisRepository.findOne({ where: { id } });
  }

  async getRecentAnalyses(limit: number = 10): Promise<EmailAnalysis[]> {
    return await this.emailAnalysisRepository.find({
      order: { analyzedAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }

  async getScamAnalyses(userId?: string): Promise<EmailAnalysis[]> {
    const where: any = { isScam: true };
    if (userId) {
      where.userId = userId;
    }

    return await this.emailAnalysisRepository.find({
      where,
      order: { analyzedAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getAnalysisStats(userId?: string): Promise<any> {
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
}
