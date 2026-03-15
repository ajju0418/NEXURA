import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create test user
    const passwordHash = await bcrypt.hash('Nexura@123', 12);

    const user = await prisma.user.upsert({
        where: { email: 'admin@nexura.com' },
        update: {},
        create: {
            email: 'admin@nexura.com',
            passwordHash,
            name: 'Alex Chen',
            age: 28,
            userId: 'ALEX-01',
            timezone: 'Asia/Kolkata',
            currency: 'INR',
            emailVerified: true,
            settings: {
                create: {
                    assistantName: 'NEXURA AI',
                    aiPersonality: 'balanced',
                },
            },
            onboarding: {
                create: {
                    wellnessScore: 7,
                    productivityScore: 8,
                    financeScore: 6,
                    relationshipsScore: 7,
                    learningScore: 9,
                    sleepScore: 6,
                    primaryGoals: JSON.stringify([
                        'Improve daily exercise routine',
                        'Better financial management',
                        'Enhance work productivity',
                    ]),
                    currentHabits: JSON.stringify([
                        'Morning meditation',
                        'Daily reading',
                        'Expense tracking',
                    ]),
                    monthlyBudget: 15000,
                    wakeTime: '07:00',
                    bedTime: '23:00',
                },
            },
        },
    });

    console.log('✅ Created test user:', user.email);

    // Create demo habits
    const habits = await Promise.all([
        prisma.habit.upsert({
            where: { id: 'habit-meditation' },
            update: {},
            create: {
                id: 'habit-meditation',
                userId: user.id,
                name: 'Morning Meditation',
                icon: 'brain',
                color: '#10B981',
                streak: 12,
                longestStreak: 15,
                totalCompletions: 45,
                targetTime: '06:30',
                reminderEnabled: true,
            },
        }),
        prisma.habit.upsert({
            where: { id: 'habit-exercise' },
            update: {},
            create: {
                id: 'habit-exercise',
                userId: user.id,
                name: 'Exercise',
                icon: 'zap',
                color: '#22D3EE',
                streak: 8,
                longestStreak: 14,
                totalCompletions: 38,
                targetTime: '07:30',
                reminderEnabled: true,
            },
        }),
        prisma.habit.upsert({
            where: { id: 'habit-reading' },
            update: {},
            create: {
                id: 'habit-reading',
                userId: user.id,
                name: 'Daily Reading',
                icon: 'book',
                color: '#8B5CF6',
                streak: 15,
                longestStreak: 20,
                totalCompletions: 60,
                targetTime: '21:00',
                reminderEnabled: false,
            },
        }),
        prisma.habit.upsert({
            where: { id: 'habit-hydration' },
            update: {},
            create: {
                id: 'habit-hydration',
                userId: user.id,
                name: 'Hydration (8 glasses)',
                icon: 'droplets',
                color: '#06B6D4',
                streak: 5,
                longestStreak: 10,
                totalCompletions: 30,
                targetTime: '08:00',
                reminderEnabled: true,
            },
        }),
        prisma.habit.upsert({
            where: { id: 'habit-sleep' },
            update: {},
            create: {
                id: 'habit-sleep',
                userId: user.id,
                name: 'Early Sleep',
                icon: 'moon',
                color: '#6366F1',
                streak: 3,
                longestStreak: 7,
                totalCompletions: 20,
                targetTime: '23:00',
                reminderEnabled: true,
            },
        }),
    ]);

    console.log(`✅ Created ${habits.length} demo habits`);

    // Create demo goals
    await Promise.all([
        prisma.goal.upsert({
            where: { id: 'goal-meditation' },
            update: {},
            create: {
                id: 'goal-meditation',
                userId: user.id,
                name: 'Meditation Sessions',
                type: 'habit',
                target: 7,
                current: 5,
                unit: 'sessions',
                icon: 'brain',
                color: '#10B981',
                deadline: 'This Week',
            },
        }),
        prisma.goal.upsert({
            where: { id: 'goal-workout' },
            update: {},
            create: {
                id: 'goal-workout',
                userId: user.id,
                name: 'Workout Sessions',
                type: 'habit',
                target: 5,
                current: 3,
                unit: 'sessions',
                icon: 'zap',
                color: '#22D3EE',
                deadline: 'This Week',
            },
        }),
        prisma.goal.upsert({
            where: { id: 'goal-budget' },
            update: {},
            create: {
                id: 'goal-budget',
                userId: user.id,
                name: 'Food Budget',
                type: 'budget',
                target: 14000,
                current: 8500,
                unit: '₹',
                icon: 'wallet',
                color: '#D946EF',
                deadline: 'This Month',
            },
        }),
        prisma.goal.upsert({
            where: { id: 'goal-reading' },
            update: {},
            create: {
                id: 'goal-reading',
                userId: user.id,
                name: 'Reading Streak',
                type: 'milestone',
                target: 30,
                current: 15,
                unit: 'days',
                icon: 'award',
                color: '#F59E0B',
                deadline: 'Ongoing',
            },
        }),
        prisma.goal.upsert({
            where: { id: 'goal-sleep' },
            update: {},
            create: {
                id: 'goal-sleep',
                userId: user.id,
                name: 'Early Sleep Routine',
                type: 'habit',
                target: 7,
                current: 4,
                unit: 'nights',
                icon: 'moon',
                color: '#A855F7',
                deadline: 'This Week',
            },
        }),
    ]);

    console.log('✅ Created 5 demo goals');

    // Create demo expenses
    const expenseDate = (daysAgo: number, hours: number = 12) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        d.setHours(hours, 0, 0, 0);
        return d;
    };

    await Promise.all([
        prisma.expense.upsert({
            where: { id: 'expense-1' },
            update: {},
            create: {
                id: 'expense-1',
                userId: user.id,
                amount: 180,
                category: 'coffee',
                description: 'Morning coffee at Starbucks',
                date: expenseDate(0, 9),
                impact: 'neutral',
            },
        }),
        prisma.expense.upsert({
            where: { id: 'expense-2' },
            update: {},
            create: {
                id: 'expense-2',
                userId: user.id,
                amount: 450,
                category: 'food',
                description: 'Lunch at office canteen',
                date: expenseDate(0, 13),
                impact: 'neutral',
            },
        }),
        prisma.expense.upsert({
            where: { id: 'expense-3' },
            update: {},
            create: {
                id: 'expense-3',
                userId: user.id,
                amount: 200,
                category: 'transport',
                description: 'Uber to office',
                date: expenseDate(0, 8),
                impact: 'neutral',
            },
        }),
        prisma.expense.upsert({
            where: { id: 'expense-4' },
            update: {},
            create: {
                id: 'expense-4',
                userId: user.id,
                amount: 1200,
                category: 'shopping',
                description: 'New headphones',
                date: expenseDate(1, 16),
                impact: 'positive',
            },
        }),
        prisma.expense.upsert({
            where: { id: 'expense-5' },
            update: {},
            create: {
                id: 'expense-5',
                userId: user.id,
                amount: 800,
                category: 'entertainment',
                description: 'Movie tickets & popcorn',
                date: expenseDate(2, 19),
                impact: 'positive',
            },
        }),
        prisma.expense.upsert({
            where: { id: 'expense-6' },
            update: {},
            create: {
                id: 'expense-6',
                userId: user.id,
                amount: 350,
                category: 'food',
                description: 'Dinner at restaurant',
                date: expenseDate(1, 20),
                impact: 'neutral',
            },
        }),
        prisma.expense.upsert({
            where: { id: 'expense-7' },
            update: {},
            create: {
                id: 'expense-7',
                userId: user.id,
                amount: 150,
                category: 'coffee',
                description: 'Coffee with friends',
                date: expenseDate(2, 15),
                impact: 'positive',
            },
        }),
        prisma.expense.upsert({
            where: { id: 'expense-8' },
            update: {},
            create: {
                id: 'expense-8',
                userId: user.id,
                amount: 500,
                category: 'food',
                description: 'Weekly groceries',
                date: expenseDate(3, 11),
                impact: 'neutral',
            },
        }),
    ]);

    console.log('✅ Created 8 demo expenses');

    console.log('\n🎉 Seed complete!');
    console.log('📧 Email: admin@nexura.com');
    console.log('🔑 Password: Nexura@123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
