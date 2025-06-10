import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AnalyzeEmailDto, EmailAnalysisResultDto } from '../dto/email-analysis.dto';
import { AiService } from '../services/ai.service';

@ApiTags('emails')
@Controller('emails')
export class EmailController {
  constructor(private readonly aiService: AiService) {}
  
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
  async analyzeEmail(@Body() analyzeEmailDto: AnalyzeEmailDto): Promise<EmailAnalysisResultDto> {
    return await this.aiService.analyzeEmail(analyzeEmailDto);
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
  async bulkAnalyzeEmails(@Body() emails: AnalyzeEmailDto[]): Promise<EmailAnalysisResultDto[]> {
    return await this.aiService.bulkAnalyzeEmails(emails);
  }
}
