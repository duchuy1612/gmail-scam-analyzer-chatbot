import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, UnauthorizedException, ConflictException, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password, returns JWT token'
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials'
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid email or password' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' }, example: ['email must be a valid email'] },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const { user, token, refreshToken } = await this.authService.login(loginDto.email, loginDto.password);

      return {
        accessToken: token,
        refreshToken,
        user,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User registration',
    description: 'Create a new user account and return JWT token'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration information'
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email already registered' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid registration data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' }, example: ['password must be longer than or equal to 6 characters'] },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const { user, token, refreshToken } = await this.authService.register({
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name,
      });

      return {
        accessToken: token,
        refreshToken,
        user,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      };
    } catch (error) {
      if (error.message === 'Email already registered') {
        throw new ConflictException('Email already registered');
      }
      throw new BadRequestException('Registration failed');
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh JWT token',
    description: 'Get a new access token using a valid refresh token'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' }
      },
      required: ['refreshToken']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        expiresAt: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token'
  })
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: string }> {
    try {
      const { token, refreshToken: newRefresh, expiresAt } = await this.authService.refreshToken(refreshToken);
      return { accessToken: token, refreshToken: newRefresh, expiresAt };
    } catch (error) {
      // Log the error details for debugging
      console.error('Error refreshing token:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current user', description: 'Get info for authenticated user' })
  @ApiResponse({ status: 200 })
  async getMe(@Request() req) {
    return req.user;
  }
}
