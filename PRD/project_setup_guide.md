# QuizMentor Project Setup Guide

## 1. Initial Project Setup

### Create Next.js Application
```bash
npx create-next-app@latest quizmentor --typescript --tailwind --eslint --app --src-dir
cd quizmentor
```

### Install Core Dependencies
```bash
# Database & ORM
npm install @prisma/client prisma

# Authentication
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# UI Components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label textarea select dropdown-menu dialog toast tabs badge avatar

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Icons & Styling
npm install lucide-react clsx tailwind-merge

# Date & Time
npm install date-fns

# Charts & Analytics
npm install recharts

# AI Integration
npm install openai

# Utilities
npm install lodash @types/lodash
```

### Development Dependencies
```bash
npm install -D @types/node @types/react @types/react-dom prettier eslint-config-prettier
```

## 2. Project Structure

```
quizmentor/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── student/
│   │   │   └── teacher/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── quizzes/
│   │   │   ├── questions/
│   │   │   └── ai/
│   │   ├── quiz/
│   │   │   └── [id]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   ├── quiz/
│   │   ├── dashboard/
│   │   └── shared/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── ai.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── quiz.ts
│   │   └── database.ts
│   └── hooks/
│       ├── useAuth.ts
│       └── useQuiz.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.local
├── .env.example
├── tailwind.config.js
├── components.json
└── tsconfig.json
```

## 3. Environment Configuration

### Create `.env.local`
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quizmentor"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Create `.env.example`
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quizmentor"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## 4. Tailwind Configuration

### Update `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 5. TypeScript Configuration

### Update `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 6. Prettier Configuration

### Create `.prettierrc`
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 7. ESLint Configuration

### Update `.eslintrc.json`
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
```

## 8. Package.json Scripts

### Update `package.json` scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## 9. Git Configuration

### Create `.gitignore`
```
# Dependencies
node_modules/

# Production
.next/
out/

# Runtime data
*.log
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# Prisma
prisma/migrations/
```

## 10. Development Commands

### Setup Commands
```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev

# Format code
npm run format

# Lint code
npm run lint
```

## 11. Development Workflow

### Daily Development Process
1. **Start development server:** `npm run dev`
2. **Open Cursor AI** and load the project
3. **Use AI for component generation:** Ask Cursor to create components based on specifications
4. **Test changes:** Check functionality in browser
5. **Format and lint:** `npm run format && npm run lint`
6. **Commit changes:** Follow conventional commit messages

### AI-Assisted Development Tips
- **Use descriptive prompts:** "Create a React component for quiz taking interface with timer"
- **Provide context:** Reference existing components and patterns
- **Iterate quickly:** Use AI to modify and enhance existing code
- **Test thoroughly:** Always test AI-generated code before committing

## 12. Next Steps

After completing this setup:

1. **Review database schema** (see `02-database-schema.md`)
2. **Implement authentication** (see `03-authentication-setup.md`)
3. **Create core components** (see `04-core-components.md`)
4. **Build API endpoints** (see `05-api-endpoints.md`)

This setup provides a solid foundation for rapid development with Cursor AI while maintaining code quality and project structure.