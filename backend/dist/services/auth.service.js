"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor() {
        this.users = [];
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    }
    async register(userData) {
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.push(user);
        const token = jwt.sign({ sub: user.id, email: user.email }, this.jwtSecret, { expiresIn: '24h' });
        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        return { user: userResponse, token };
    }
    async login(email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ sub: user.id, email: user.email }, this.jwtSecret, { expiresIn: '24h' });
        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        return { user: userResponse, token };
    }
    async validateToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            const user = this.users.find(u => u.id === decoded.sub);
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                email: user.email,
                name: user.name,
            };
        }
        catch (_a) {
            return null;
        }
    }
    async refreshToken(oldToken) {
        try {
            const decoded = jwt.verify(oldToken, this.jwtSecret);
            const user = this.users.find(u => u.id === decoded.sub);
            if (!user) {
                throw new Error('Invalid token');
            }
            const newToken = jwt.sign({ sub: user.id, email: user.email }, this.jwtSecret, { expiresIn: '24h' });
            return {
                token: newToken,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };
        }
        catch (_a) {
            throw new Error('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map