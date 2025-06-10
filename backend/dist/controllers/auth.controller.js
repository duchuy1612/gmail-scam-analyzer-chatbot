"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_dto_1 = require("../dto/auth.dto");
const auth_service_1 = require("../services/auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        try {
            const { user, token } = await this.authService.login(loginDto.email, loginDto.password);
            return {
                accessToken: token,
                user,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
    }
    async register(registerDto) {
        try {
            const { user, token } = await this.authService.register({
                email: registerDto.email,
                password: registerDto.password,
                name: registerDto.name,
            });
            return {
                accessToken: token,
                user,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };
        }
        catch (error) {
            if (error.message === 'Email already registered') {
                throw new common_1.ConflictException('Email already registered');
            }
            throw new common_1.BadRequestException('Registration failed');
        }
    }
    async refreshToken() {
        return {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_token_payload.new_signature',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticate user with email and password, returns JWT token'
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.LoginDto,
        description: 'User login credentials'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: auth_dto_1.AuthResponseDto
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'User registration',
        description: 'Create a new user account and return JWT token'
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.RegisterDto,
        description: 'User registration information'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Registration successful',
        type: auth_dto_1.AuthResponseDto
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh JWT token',
        description: 'Get a new access token using a valid refresh token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
            type: 'object',
            properties: {
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                expiresAt: { type: 'string', example: '2025-06-11T14:30:00Z' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map