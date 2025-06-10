import { CreateUserData, UserResponse } from '../entities/user.entity';
export declare class AuthService {
    private users;
    private readonly jwtSecret;
    register(userData: CreateUserData): Promise<{
        user: UserResponse;
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: UserResponse;
        token: string;
    }>;
    validateToken(token: string): Promise<UserResponse | null>;
    refreshToken(oldToken: string): Promise<{
        token: string;
        expiresAt: string;
    }>;
}
