import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './schemas/signup.schema';
import { LoginDto } from './schemas/login.schema';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signup(signupDto: SignupDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: signupDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(signupDto.password, 12);

        // Generate unique userId
        const userId = await this.generateUserId(signupDto.name);

        // Create user with settings and onboarding
        const user = await this.prisma.user.create({
            data: {
                email: signupDto.email,
                passwordHash,
                name: signupDto.name,
                age: signupDto.age,
                userId,
                settings: {
                    create: {
                        // Use defaults from schema
                    },
                },
                onboarding: {
                    create: {
                        wellnessScore: signupDto.onboarding.lifeAreas.wellness,
                        productivityScore: signupDto.onboarding.lifeAreas.productivity,
                        financeScore: signupDto.onboarding.lifeAreas.finance,
                        relationshipsScore: signupDto.onboarding.lifeAreas.relationships,
                        learningScore: signupDto.onboarding.lifeAreas.learning,
                        sleepScore: signupDto.onboarding.lifeAreas.sleep,
                        primaryGoals: JSON.stringify(signupDto.onboarding.primaryGoals),
                        currentHabits: JSON.stringify(signupDto.onboarding.currentHabits),
                        monthlyBudget: signupDto.onboarding.budget,
                        wakeTime: signupDto.onboarding.wakeTime,
                        bedTime: signupDto.onboarding.bedTime,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                userId: true,
            },
        });

        // Generate tokens
        const { accessToken, refreshToken } = await this.generateTokens(user.id);

        // Create auth session
        await this.createAuthSession(user.id, refreshToken);

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async login(loginDto: LoginDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
            select: {
                id: true,
                email: true,
                name: true,
                userId: true,
                passwordHash: true,
                isActive: true,
                isDeleted: true,
            },
        });

        if (!user || user.isDeleted || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate tokens
        const { accessToken, refreshToken } = await this.generateTokens(user.id);

        // Create auth session
        await this.createAuthSession(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                userId: user.userId,
            },
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(userId: string, sessionId: string) {
        // Update session last used
        await this.prisma.authSession.update({
            where: { id: sessionId },
            data: { lastUsedAt: new Date() },
        });

        // Generate new access token
        const accessToken = this.jwtService.sign(
            { sub: userId },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            },
        );

        // Optionally rotate refresh token (recommended for security)
        const refreshToken = this.jwtService.sign(
            { sub: userId },
            {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
            },
        );

        // Update session with new refresh token
        const expiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
        const expiresAt = this.calculateExpiryDate(expiresIn);

        await this.prisma.authSession.update({
            where: { id: sessionId },
            data: {
                refreshToken,
                expiresAt,
                lastUsedAt: new Date(),
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async logout(userId: string) {
        // Revoke all user sessions
        await this.prisma.authSession.updateMany({
            where: {
                userId,
                isRevoked: false,
            },
            data: {
                isRevoked: true,
            },
        });

        return { message: 'Logged out successfully' };
    }

    async getCurrentUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                userId: true,
                avatar: true,
                timezone: true,
                currency: true,
                dateFormat: true,
                emailVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    private async generateTokens(userId: string) {
        const accessToken = this.jwtService.sign(
            { sub: userId },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            },
        );

        const refreshToken = this.jwtService.sign(
            { sub: userId },
            {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
            },
        );

        return { accessToken, refreshToken };
    }

    private async createAuthSession(userId: string, refreshToken: string) {
        const expiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
        const expiresAt = this.calculateExpiryDate(expiresIn);

        return this.prisma.authSession.create({
            data: {
                userId,
                refreshToken,
                expiresAt,
            },
        });
    }

    private calculateExpiryDate(expiresIn: string): Date {
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match) {
            throw new BadRequestException('Invalid expiry format');
        }

        const value = parseInt(match[1]);
        const unit = match[2];

        const now = new Date();

        switch (unit) {
            case 's':
                return new Date(now.getTime() + value * 1000);
            case 'm':
                return new Date(now.getTime() + value * 60 * 1000);
            case 'h':
                return new Date(now.getTime() + value * 60 * 60 * 1000);
            case 'd':
                return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
            default:
                throw new BadRequestException('Invalid time unit');
        }
    }

    private async generateUserId(name: string): Promise<string> {
        // Extract first name and convert to uppercase
        const firstName = name.split(' ')[0].toUpperCase();

        // Find the highest number for this name
        const existingUsers = await this.prisma.user.findMany({
            where: {
                userId: {
                    startsWith: `${firstName}-`,
                },
            },
            select: {
                userId: true,
            },
            orderBy: {
                userId: 'desc',
            },
            take: 1,
        });

        let number = 1;
        if (existingUsers.length > 0) {
            const lastUserId = existingUsers[0].userId;
            const lastNumber = parseInt(lastUserId.split('-')[1]);
            number = lastNumber + 1;
        }

        return `${firstName}-${number.toString().padStart(2, '0')}`;
    }
}
