import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { CreateUserData, UserResponse } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  constructor(private userService: UserService) {}

  async register(userData: CreateUserData): Promise<{ user: UserResponse; token: string }> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await this.userService.createUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
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

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return { user: userResponse, token };
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

  async refreshToken(oldToken: string): Promise<{ token: string; expiresAt: string }> {
    try {
      const decoded = jwt.verify(oldToken, this.jwtSecret) as { sub: string; email: string };
      const user = await this.userService.findById(decoded.sub);
      
      if (!user) {
        throw new Error('Invalid token');
      }

      const newToken = jwt.sign(
        { sub: user.id, email: user.email },
        this.jwtSecret,
        { expiresIn: '24h' }
      );

      return {
        token: newToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    } catch {
      throw new Error('Invalid token');
    }
  }
}
