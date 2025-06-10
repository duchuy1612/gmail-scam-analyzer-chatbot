import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';

export class AnalyzeEmailDto {
  @ApiProperty({
    description: 'The email subject line',
    example: 'Urgent: Your account will be suspended'
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'The email body content',
    example: 'Dear valued customer, your account will be suspended unless you verify your information immediately...'
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Sender email address',
    example: 'noreply@suspicious-bank.com'
  })
  @IsEmail()
  sender: string;

  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com'
  })
  @IsEmail()
  recipient: string;

  @ApiProperty({
    description: 'Email headers for additional analysis',
    example: ['Return-Path: <bounce@suspicious-bank.com>', 'X-Originating-IP: [192.168.1.1]'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  headers?: string[];

  @ApiProperty({
    description: 'URLs found in the email content',
    example: ['https://suspicious-bank-verify.com/login', 'https://bit.ly/3xyz123'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  urls?: string[];
}

export class EmailAnalysisResultDto {
  @ApiProperty({
    description: 'Scam probability score (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  scamProbability: number;

  @ApiProperty({
    description: 'Risk level classification',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    example: 'HIGH'
  })
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @ApiProperty({
    description: 'Detailed explanation of the analysis',
    example: 'This email contains multiple scam indicators including urgency tactics, suspicious links, and sender domain mismatch.'
  })
  explanation: string;

  @ApiProperty({
    description: 'Specific red flags identified',
    example: ['Urgent language', 'Suspicious domain', 'Phishing links', 'Grammar errors']
  })
  redFlags: string[];

  @ApiProperty({
    description: 'Analysis confidence score (0-1)',
    example: 0.92,
    minimum: 0,
    maximum: 1
  })
  confidence: number;

  @ApiProperty({
    description: 'Timestamp of analysis',
    example: '2025-06-10T14:30:00Z'
  })
  analyzedAt: string;

  @ApiProperty({
    description: 'Unique analysis ID for tracking',
    example: 'analysis_abc123def456'
  })
  analysisId: string;
}
