import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { CreateUserData, UserResponse } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  constructor(
    private userService: UserService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  private async generateRefreshToken(userId: string): Promise<RefreshToken> {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refresh = this.refreshTokenRepo.create({ userId, token, expiresAt });
    return await this.refreshTokenRepo.save(refresh);
  }

  async validateRefreshToken(token: string): Promise<RefreshToken | null> {
async validateRefreshToken(token: string): Promise<RefreshToken | null> {
    // Import and use a sanitization library like validator
    // validator.escape sanitizes the input to prevent NoSQL injection
    const sanitizedToken = validator.escape(token);
    const refresh = await this.refreshTokenRepo.findOne({ where: { token: sanitizedToken } });
    if (!refresh || refresh.expiresAt < new Date()) {
      return null;
    }
    if (!refresh || refresh.expiresAt < new Date()) {
      return null;
    }
    return refresh;
  }

async validateRefreshToken(token: string): Promise<RefreshToken | null> {
    const refresh = await this.refreshTokenRepo.findOne({ where: { token } });
    if (!refresh || refresh.expiresAt < new Date()) {
      return null;
    }
    return refresh;
  }

  private async generateAuthTokens(user: UserResponse): Promise<{ token: string; refreshToken: string }> {
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
    const refresh = await this.generateRefreshToken(user.id);
    return { token, refreshToken: refresh.token };
  }

  async register(userData: CreateUserData): Promise<{ user: UserResponse; token: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await this.userService.createUser(userData);

    // Generate tokens
    const { token, refreshToken } = await this.generateAuthTokens(user);

    return { user, token, refreshToken };
  }

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string; refreshToken: string }> {
    // Find user
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.userService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const { token, refreshToken } = await this.generateAuthTokens(user);
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await this.userService.createUser(userData);

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    const refresh = await this.generateRefreshToken(user.id);

    return { user, token, refreshToken: refresh.token };
  }

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string; refreshToken: string }> {
    // Find user
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.userService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    const refresh = await this.generateRefreshToken(user.id);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return { user: userResponse, token, refreshToken: refresh.token };
  }

  async validateToken(token: string): Promise<UserResponse | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { sub: string; email: string };
      const user = await this.userService.findById(decoded.sub);
      
      return user;
    } catch {
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string; expiresAt: string }> {
    const existing = await this.validateRefreshToken(refreshToken);
    if (!existing) {
      throw new Error('Invalid token');
    }

    const user = await this.userService.findById(existing.userId);
    if (!user) {
      throw new Error('Invalid token');
    }

    const newToken = jwt.sign(
      { sub: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

{ expiresIn: '24h' }
    );

    // Use a typed parameter to ensure type safety and prevent NoSQL injection
    await this.refreshTokenRepo.delete({ id: existing.id as string });
    const newRefresh = await this.generateRefreshToken(user.id);

    return {
    const newRefresh = await this.generateRefreshToken(user.id);

    return {
      token: newToken,
      refreshToken: newRefresh.token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}
