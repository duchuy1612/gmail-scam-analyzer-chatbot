import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'd4f1e2...'
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 'user_123',
      email: 'user@example.com',
      name: 'John Doe'
    }
  })
  user: {
    id: string;
    email: string;
    name: string;
  };

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2025-06-11T14:30:00Z'
  })
  expiresAt: string;
}
