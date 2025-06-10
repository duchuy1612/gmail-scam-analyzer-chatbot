import { LoginDto, RegisterDto, AuthResponseDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    refreshToken(): Promise<{
        accessToken: string;
        expiresAt: string;
    }>;
}
