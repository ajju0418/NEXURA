# NEXURA - Behavioral Intelligence System

**AI-Powered Personal Analytics & Habit Tracking Platform**

A full-stack application for tracking habits, managing goals, analyzing expenses, and gaining behavioral insights through AI-driven pattern recognition.

---

## 🏗️ Project Structure

```
NEXURA/
├── frontend/          # Next.js 15 + React 18 + TypeScript
├── backend/           # NestJS + Prisma + PostgreSQL
├── docs/              # Documentation
└── package.json       # Monorepo workspace configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 15+
- **Redis** (optional, for rate limiting)

### Installation

```bash
# Install all dependencies (root + frontend + backend)
npm run install:all

# Or install individually
npm install          # Root dependencies
cd frontend && npm install
cd backend && npm install
```

### Development

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3001
npm run dev:backend   # Backend on http://localhost:3000
```

### Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with test data
npx prisma:seed
```

### Frontend Setup

```bash
cd frontend

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 📦 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** React 18, TypeScript
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Authentication:** JWT + Refresh Tokens
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest + Supertest

---

## 🎯 Features

### ✅ Implemented (Backend)

**Phase 1: Authentication & Infrastructure**
- ✅ User signup and login
- ✅ JWT authentication with refresh tokens
- ✅ Session management
- ✅ User settings
- ✅ Onboarding flow

**Phase 2: Core Business Logic**
- ✅ Habits CRUD with streak calculation
- ✅ Goals CRUD with auto-completion
- ✅ Expenses CRUD with analytics
- ✅ Timeline event aggregation
- ✅ Ownership enforcement
- ✅ Soft delete support

### 🚧 In Progress (Frontend)

- ⚠️ Backend API integration (currently using mock data)
- ⚠️ State management (needs Zustand implementation)
- ⚠️ Real-time data synchronization
- ⚠️ Error handling and validation

### 📋 Planned (Phase 3)

- [ ] AI-powered insights generation
- [ ] Pattern recognition and predictions
- [ ] Advanced analytics dashboard
- [ ] Notifications system
- [ ] Data export/import
- [ ] Mobile app (React Native)

---

## 📚 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Frontend Audit Report](./docs/frontend_audit_report.md)
- [Backend Requirements](./docs/backend_requirements.md)
- [Phase 1 Walkthrough](./docs/phase1_walkthrough.md)
- [Phase 2 Walkthrough](./docs/phase2_walkthrough.md)
- [API Documentation](http://localhost:3000/api/docs) (when backend is running)

---

## 🔧 Available Scripts

### Root Level

```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build both projects
npm run install:all      # Install all dependencies
npm run clean            # Clean all node_modules and build files
npm run lint             # Lint both projects
```

### Frontend

```bash
cd frontend
npm run dev              # Development server (port 3001)
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
npm run export           # Export static site
```

### Backend

```bash
cd backend
npm run start:dev        # Development server (port 3000)
npm run build            # Production build
npm run start:prod       # Start production server
npm run test             # Run tests
npm run test:e2e         # Run E2E tests
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
```

---

## 🗄️ Database Schema

### Core Entities

1. **User** - User accounts and profiles
2. **AuthSession** - JWT session management
3. **UserSettings** - User preferences
4. **OnboardingProfile** - Initial user assessment
5. **Habit** - User habits with streak tracking
6. **HabitCompletion** - Individual completion records
7. **Goal** - User goals with progress tracking
8. **Expense** - Financial tracking
9. **TimelineEvent** - Polymorphic event aggregation

See [Backend README](./backend/README.md) for detailed schema documentation.

---

## 🔐 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/nexura_db"
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

See `.env.example` files in each directory for complete configuration.

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Credentials

After running `npx prisma:seed`:

```
Email: admin@nexura.com
Password: nexura123
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
npm run export  # For static export
```

### Backend (Railway/Render/AWS)

```bash
cd backend
npm run build
npm run start:prod
```

### Docker (Coming Soon)

```bash
docker-compose up
```

---

## 📊 Project Status

| Component | Status | Completion |
|-----------|--------|------------|
| **Backend API** | ✅ Production Ready | 100% |
| **Database Schema** | ✅ Complete | 100% |
| **Authentication Backend** | ✅ Complete | 100% |
| **Authentication Frontend** | ✅ Complete | 100% |
| **Business Logic** | ✅ Complete | 100% |
| **Frontend UI** | ✅ Complete | 100% |
| **Auth Integration** | ✅ Complete | 100% |
| **State Management** | ✅ Complete (Auth) | 80% |
| **Protected Routes** | ✅ Complete | 100% |
| **Data Integration** | ⚠️ In Progress | 40% |
| **Testing** | ⚠️ Partial | 60% |
| **Documentation** | ✅ Complete | 100% |

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write/update tests
4. Update documentation
5. Submit pull request

---

## 📄 License

Private - NEXURA Team

---

## 🆘 Support

For issues or questions:
- Check documentation in `/docs`
- Review API docs at http://localhost:3000/api/docs
- See audit reports for known issues

---

**Built with ❤️ by the NEXURA Team**
