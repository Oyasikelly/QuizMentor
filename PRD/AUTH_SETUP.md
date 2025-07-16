# QuizMentor Authentication Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to Settings > API in your Supabase dashboard
3. Copy the "Project URL" and "anon public" key
4. Replace the placeholder values in your `.env.local` file

## Features Implemented

### Authentication Pages

- **Login Page** (`/login`): Email and password sign-in
- **Register Page** (`/register`): Email, password, and confirm password sign-up
- **Dashboard Page** (`/dashboard`): Protected page with user info and sign-out

### Features

- ✅ Form validation with Zod and React Hook Form
- ✅ Loading states with spinners
- ✅ Error message display
- ✅ Responsive design with Tailwind CSS
- ✅ ShadCN UI components
- ✅ Automatic redirect to dashboard after successful auth
- ✅ Session persistence
- ✅ Sign out functionality

### Components Created

- `AuthForm`: Reusable component for both login and register
- `Button`: Styled button component with variants
- `Input`: Styled input component
- `Card`: Card layout component with header, content, and footer

## Usage

1. Start the development server: `npm run dev`
2. Navigate to `/login` or `/register`
3. Create an account or sign in
4. You'll be redirected to the dashboard upon successful authentication

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── auth-form.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── card.tsx
└── lib/
    ├── supabase.ts
    └── utils.ts
```
