import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Basic health check endpoint to verify the API is running'
  })
  @ApiResponse({
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
  })
  getHello(): object {
    return {
      message: this.appService.getHello(),
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Detailed health check',
    description: 'Comprehensive health check including service dependencies'
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 503,
    description: 'Service unhealthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'unhealthy' },
        errors: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  getDetailedHealth(): object {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected', // TODO: Check actual database connection
        aiService: 'connected', // TODO: Check AI service connection
        cache: 'connected' // TODO: Check cache connection
      }
    };
  }
}
