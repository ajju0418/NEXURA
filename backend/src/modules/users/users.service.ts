import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        return this.prisma.user.findUnique({
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
                settings: true,
                onboarding: true,
            },
        });
    }

    async updateProfile(userId: string, data: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                avatar: data.avatar,
                timezone: data.timezone,
                currency: data.currency,
                dateFormat: data.dateFormat,
            },
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
    }

    async getSettings(userId: string) {
        const settings = await this.prisma.userSettings.findUnique({
            where: { userId },
        });

        if (!settings) {
            // Create default settings if they don't exist
            return this.prisma.userSettings.create({
                data: { userId },
            });
        }

        return settings;
    }

    async updateSettings(userId: string, data: any) {
        const existing = await this.prisma.userSettings.findUnique({
            where: { userId },
        });

        if (!existing) {
            return this.prisma.userSettings.create({
                data: { userId, ...data },
            });
        }

        return this.prisma.userSettings.update({
            where: { userId },
            data,
        });
    }

    async getDashboardStats(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get month boundaries
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        // Get week boundaries
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const [
            habits,
            todayCompletions,
            goals,
            monthExpenses,
            onboarding,
            user,
        ] = await Promise.all([
            this.prisma.habit.findMany({
                where: { userId, isDeleted: false, isActive: true },
            }),
            this.prisma.habitCompletion.findMany({
                where: {
                    userId,
                    completedAt: { gte: today, lt: tomorrow },
                },
            }),
            this.prisma.goal.findMany({
                where: { userId, isDeleted: false },
            }),
            this.prisma.expense.findMany({
                where: {
                    userId,
                    isDeleted: false,
                    date: { gte: monthStart, lte: monthEnd },
                },
            }),
            this.prisma.onboardingProfile.findUnique({
                where: { userId },
            }),
            this.prisma.user.findUnique({
                where: { id: userId },
                select: { name: true, userId: true },
            }),
        ]);

        const totalHabits = habits.length;
        const completedToday = todayCompletions.length;

        const totalExpensesThisMonth = monthExpenses.reduce(
            (sum, e) => sum + Number(e.amount),
            0,
        );

        const monthlyBudget = onboarding?.monthlyBudget || 15000;
        const budgetLeft = monthlyBudget - totalExpensesThisMonth;

        // Calculate habit completion rate for the week
        const weekDays = Math.min(
            Math.ceil((today.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1,
            7,
        );
        const weeklyTarget = totalHabits * weekDays;
        const weekCompletions = await this.prisma.habitCompletion.count({
            where: {
                userId,
                completedAt: { gte: weekStart, lt: tomorrow },
            },
        });
        const weekProgress = weeklyTarget > 0 ? Math.round((weekCompletions / weeklyTarget) * 100) : 0;

        // Best streak among all habits
        const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

        // Health/Performance scores from onboarding + actual data
        const wellnessBase = onboarding?.wellnessScore || 5;
        const productivityBase = onboarding?.productivityScore || 5;
        const financeBase = onboarding?.financeScore || 5;
        const sleepBase = onboarding?.sleepScore || 5;
        const socialBase = onboarding?.relationshipsScore || 5;
        const learningBase = onboarding?.learningScore || 5;

        // Dynamic adjustments based on real data
        const habitCompletionRate = totalHabits > 0 ? completedToday / totalHabits : 0;
        const budgetUtilization = monthlyBudget > 0 ? 1 - (totalExpensesThisMonth / monthlyBudget) : 0.5;

        const performanceData = [
            { subject: 'Wellness', A: Math.min(100, Math.round(wellnessBase * 10 + habitCompletionRate * 15)) },
            { subject: 'Productivity', A: Math.min(100, Math.round(productivityBase * 10 + habitCompletionRate * 10)) },
            { subject: 'Finance', A: Math.min(100, Math.round(financeBase * 10 + budgetUtilization * 20)) },
            { subject: 'Sleep', A: Math.min(100, sleepBase * 10) },
            { subject: 'Focus', A: Math.min(100, Math.round(productivityBase * 8 + habitCompletionRate * 20)) },
            { subject: 'Social', A: Math.min(100, socialBase * 10) },
        ];

        const topScore = performanceData.reduce((best, p) => p.A > best.A ? p : best, performanceData[0]);
        const lowScore = performanceData.reduce((worst, p) => p.A < worst.A ? p : worst, performanceData[0]);

        const activeGoals = goals.filter(g => !g.isCompleted).length;
        const completedGoals = goals.filter(g => g.isCompleted).length;

        // Energy level: based on habits completed today as percentage
        const energyLevel = totalHabits > 0
            ? Math.round((completedToday / totalHabits) * 100)
            : 50;

        // Health score: avg of performance scores
        const healthScore = Math.round(
            performanceData.reduce((sum, p) => sum + p.A, 0) / performanceData.length,
        );

        return {
            user: {
                name: user?.name || 'User',
                userId: user?.userId || 'USER-01',
            },
            habits: {
                total: totalHabits,
                completedToday,
                bestStreak,
            },
            goals: {
                active: activeGoals,
                completed: completedGoals,
                total: goals.length,
            },
            expenses: {
                monthlyBudget,
                totalThisMonth: Math.round(totalExpensesThisMonth * 100) / 100,
                budgetLeft: Math.round(budgetLeft * 100) / 100,
            },
            performance: performanceData,
            stats: {
                healthScore,
                energyLevel,
                budgetLeft: Math.round(budgetLeft),
                weekProgress,
            },
            topScore: { name: topScore.subject, value: topScore.A },
            lowScore: { name: lowScore.subject, value: lowScore.A },
        };
    }
}
