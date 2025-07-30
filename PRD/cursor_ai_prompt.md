## Context

I have a Next.js 15 project (QuizMentor) that's failing to build due to TypeScript/ESLint errors. The project compiles successfully but fails during the build process due to linting issues.

## Critical Instructions

⚠️ **IMPORTANT**: Only fix the linting/TypeScript errors. DO NOT modify any existing functionality, UI components, styles, or business logic. Keep all existing code behavior intact.

## Required Fixes

### 1. Remove Unused Imports and Variables

- Remove all unused imports (components, hooks, icons, etc.)
- Remove unused variables and functions
- Keep imports that might be used in commented code or future features

### 2. Fix TypeScript Issues

- Replace all `any` types with proper TypeScript types
- Create interfaces/types where needed
- Use `unknown` or specific types instead of `any`

### 3. Fix React Hooks Issues

- Move all React hooks to the top level of components (not inside conditionals)
- Fix missing dependencies in useEffect/useCallback dependency arrays
- Ensure hooks are called in the same order every render

### 4. Fix HTML Entities

- Replace unescaped quotes and apostrophes with HTML entities:
  - `"` → `&quot;`
  - `'` → `&#39;` or `&apos;`

### 5. Fix Variable Declaration Issues

- Change `let` to `const` for variables that are never reassigned
- Keep `let` only for variables that are actually reassigned

### 6. Handle Error Variables

- Use error variables in catch blocks or remove them if not needed
- Add `// eslint-disable-next-line @typescript-eslint/no-unused-vars` if errors need to be caught but not used

## Approach Guidelines

1. **Preserve Functionality**: Every component should work exactly the same after fixes
2. **Minimal Changes**: Only change what's necessary to pass the build
3. **Type Safety**: When replacing `any`, use the most specific type possible
4. **Component Integrity**: Don't remove any JSX elements or change component structure
5. **State Management**: Keep all useState, useEffect, and other hook logic intact

## Files to Fix (in order of priority)

- `./src/app/(dashboard)/student/achievements/page.tsx`
- `./src/app/(dashboard)/student/settings/page.tsx`
- `./src/app/(dashboard)/teacher/create-quiz/page.tsx`
- `./src/app/page.tsx`
- All other files listed in the error output

## Example Transformations

### Before (Unused Import):

```typescript
import { Button, Card } from "@/components/ui";

export default function Component() {
	return <Card>Content</Card>;
}
```

### After:

```typescript
import { Card } from "@/components/ui";

export default function Component() {
	return <Card>Content</Card>;
}
```

### Before (Any Type):

```typescript
const handleData = (data: any) => {
	return data.name;
};
```

### After:

```typescript
interface DataType {
	name: string;
}

const handleData = (data: DataType) => {
	return data.name;
};
```

### Before (Hook in Conditional):

```typescript
if (user) {
	const [state, setState] = useState("");
}
```

### After:

```typescript
const [state, setState] = useState("");

if (user) {
	// use state here
}
```

## Success Criteria

- `npm run build` completes successfully
- All TypeScript errors resolved
- All ESLint errors resolved
- No functionality changes
- All existing UI/UX preserved
- All API calls and data flow remain the same

## Additional Notes

- This is a quiz management system with student and teacher dashboards
- Preserve all authentication, routing, and data fetching logic
- Keep all mock data and API integrations intact
- Maintain all existing component props and interfaces

Please fix these issues systematically, file by file, ensuring each fix resolves the specific error without introducing new problems.
