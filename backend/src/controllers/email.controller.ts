import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyzeEmailDto, EmailAnalysisResultDto } from '../dto/email-analysis.dto';
import { AiService } from '../services/ai.service';
import { EmailAnalysisService } from '../services/email-analysis.service';
import { GmailService } from '../services/gmail.service';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('emails')
@Controller('emails')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class EmailController {
  constructor(
    private readonly aiService: AiService,
    private readonly emailAnalysisService: EmailAnalysisService,
    private readonly gmailService: GmailService,
  ) {}
  
  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze email for scam indicators',
    description: 'Analyzes an email using AI to detect potential scam characteristics and provides a risk assessment'
  })
  @ApiBody({
    type: AnalyzeEmailDto,
    description: 'Email content and metadata to analyze'
  })
  @ApiResponse({
    status: 200,
    description: 'Email analysis completed successfully',
    type: EmailAnalysisResultDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email data provided',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid email format' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during analysis',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Analysis service unavailable' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 }
      }
    }
  })
  async analyzeEmail(@Body() analyzeEmailDto: AnalyzeEmailDto, @Request() req): Promise<EmailAnalysisResultDto> {
    const analysisResult = await this.aiService.analyzeEmail(analyzeEmailDto);
    
    // Save analysis to database
    await this.emailAnalysisService.createAnalysis({
      userId: req.user.id,
      emailContent: analyzeEmailDto.body,
      emailSubject: analyzeEmailDto.subject,
      emailSender: analyzeEmailDto.sender,
      analysisResult: analysisResult,
      riskScore: analysisResult.scamProbability,
      isScam: analysisResult.scamProbability > 0.5,
    });
    
    return analysisResult;
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get email analysis history',
    description: 'Retrieves the email analysis history for the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis history retrieved successfully'
  })
  async getAnalysisHistory(@Request() req) {
    return await this.emailAnalysisService.getAnalysesByUserId(req.user.id);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get email analysis statistics',
    description: 'Retrieves analysis statistics for the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully'
  })
  async getAnalysisStats(@Request() req) {
    return await this.emailAnalysisService.getAnalysisStats(req.user.id);
  }

  @Get('analysis/:id')
  @ApiOperation({
    summary: 'Get specific email analysis',
    description: 'Retrieves a specific email analysis by ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis retrieved successfully'
  })
  async getAnalysis(@Param('id') id: string) {
    return await this.emailAnalysisService.getAnalysisById(id);
  }

  @Post('bulk-analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze multiple emails at once',
    description: 'Performs batch analysis of multiple emails for scam detection'
  })
  @ApiBody({
    type: [AnalyzeEmailDto],
    description: 'Array of emails to analyze'
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk analysis completed successfully',
    type: [EmailAnalysisResultDto]
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email data in request'
  })
  async bulkAnalyzeEmails(@Body() emails: AnalyzeEmailDto[], @Request() req): Promise<EmailAnalysisResultDto[]> {
    const results = await this.aiService.bulkAnalyzeEmails(emails);
    
    // Save all analyses to database
    const promises = results.map((result, index) => 
      this.emailAnalysisService.createAnalysis({
        userId: req.user.id,
        emailContent: emails[index].body,
        emailSubject: emails[index].subject,
        emailSender: emails[index].sender,
        analysisResult: result,
        riskScore: result.scamProbability,
        isScam: result.scamProbability > 0.5,
      })
    );
    
    await Promise.all(promises);

    return results;
  }

  @Post('import-gmail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import recent Gmail messages' })
  @ApiBody({ schema: { type: 'object', properties: { accessToken: { type: 'string' } }, required: ['accessToken'] } })
  @ApiResponse({ status: 200, description: 'Messages imported successfully' })
  async importGmail(@Body('accessToken') accessToken: string, @Request() req) {
    const imported = await this.gmailService.importRecentEmails(req.user.id, accessToken);
    return { imported: imported.length };
  }
}
