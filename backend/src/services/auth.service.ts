import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, CreateUserData, UserResponse } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private users: User[] = []; // In-memory storage for demo
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  async register(userData: CreateUserData): Promise<{ user: UserResponse; token: string }> {
    // Check if user already exists
    const existingUser = this.users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);

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

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    // Find user
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
      const user = this.users.find(u => u.id === decoded.sub);
      
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch {
      return null;
    }
  }

  async refreshToken(oldToken: string): Promise<{ token: string; expiresAt: string }> {
    try {
      const decoded = jwt.verify(oldToken, this.jwtSecret) as { sub: string; email: string };
      const user = this.users.find(u => u.id === decoded.sub);
      
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
