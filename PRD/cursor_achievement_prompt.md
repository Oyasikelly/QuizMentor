# Cursor AI Implementation Prompt: Student Achievement Page

## Overview

Create a comprehensive `/student/achievements` page for QuizMentor that showcases student progress, accomplishments, and gamification elements. This page should motivate students while providing meaningful insights into their learning journey.

## Technical Requirements

### Framework & Styling

- **Next.js 14** with App Router (`app/student/achievements/page.tsx`)
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **ShadCN UI** components for consistent design
- **Recharts** for data visualization
- **React Hook Form** for any interactive forms
- **Prisma** types for database interactions

### Database Integration

```typescript
// Expected Prisma schema relationships
interface StudentAchievementData {
  user: User;
  quizAttempts: QuizAttempt[];
  achievements: Achievement[];
  badges: Badge[];
  streaks: StudyStreak[];
  performanceMetrics: PerformanceMetric[];
}
```

## Page Structure & Components

### 1. Header Section

```typescript
// Component: AchievementHeader
interface AchievementHeaderProps {
  studentName: string;
  overallGrade: string;
  totalPoints: number;
  currentRank: number;
  totalStudents: number;
}
```

**Features:**

- Welcome message with student name
- Overall performance grade (A+, A, B+, etc.)
- Total points earned
- Class ranking display
- Progress towards next achievement level

### 2. Achievement Overview Cards

```typescript
// Component: AchievementOverviewGrid
interface AchievementStats {
  totalQuizzes: number;
  averageScore: number;
  perfectScores: number;
  improvementRate: number;
  studyStreak: number;
  badgesEarned: number;
}
```

**Display metrics:**

- Total quizzes completed
- Average score across all quizzes
- Number of perfect scores (100%)
- Performance improvement rate
- Current study streak (consecutive days)
- Total badges earned

### 3. Badge Collection Section

```typescript
// Component: BadgeCollection
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'performance' | 'consistency' | 'improvement' | 'milestone';
  earnedAt: Date | null;
  requirements: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

**Badge Categories:**

- **Performance:** High score achievements, perfect scores
- **Consistency:** Study streaks, regular participation
- **Improvement:** Progress tracking, comeback achievements
- **Milestone:** Quiz completions, time-based achievements

**Visual Design:**

- Grid layout with badge cards
- Earned badges in full color
- Locked badges in grayscale with progress bars
- Hover effects showing requirements
- Rarity indicators (bronze, silver, gold, diamond)

### 4. Progress Tracking Charts

```typescript
// Component: ProgressCharts
interface ProgressData {
  performanceOverTime: Array<{
    date: string;
    score: number;
    subject: string;
  }>;
  subjectBreakdown: Array<{
    subject: string;
    averageScore: number;
    quizCount: number;
  }>;
  difficultyProgress: Array<{
    difficulty: 'Easy' | 'Medium' | 'Hard';
    successRate: number;
  }>;
}
```

**Chart Types:**

- **Line Chart:** Performance over time
- **Bar Chart:** Subject-wise performance
- **Pie Chart:** Quiz completion by difficulty
- **Area Chart:** Study time vs. performance correlation

### 5. Streak & Consistency Tracker

```typescript
// Component: StreakTracker
interface StreakData {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: Array<{
    date: string;
    quizzesCompleted: number;
    studyTime: number;
  }>;
  monthlyGoal: {
    target: number;
    achieved: number;
    percentage: number;
  };
}
```

**Features:**

- Calendar heatmap showing daily activity
- Current and longest streak counters
- Weekly/monthly goal tracking
- Streak milestone celebrations

### 6. Recent Achievements Feed

```typescript
// Component: RecentAchievements
interface RecentAchievement {
  id: string;
  type: 'badge' | 'milestone' | 'improvement';
  title: string;
  description: string;
  earnedAt: Date;
  points: number;
  celebrationLevel: 'normal' | 'special' | 'epic';
}
```

**Display:**

- Timeline of recent achievements
- Animated celebration effects for new achievements
- Point values for each achievement
- Social sharing options

### 7. Leaderboard Section

```typescript
// Component: Leaderboard
interface LeaderboardEntry {
  rank: number;
  studentName: string;
  points: number;
  avatar?: string;
  isCurrentUser: boolean;
  trend: 'up' | 'down' | 'stable';
}
```

**Features:**

- Class leaderboard with rankings
- Current user highlighting
- Trend indicators (up/down arrows)
- Filter options (weekly, monthly, all-time)
- Anonymous mode option

### 8. Goal Setting & Challenges

```typescript
// Component: GoalTracker
interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  category: 'score' | 'completion' | 'streak' | 'improvement';
  reward: string;
  status: 'active' | 'completed' | 'failed';
}
```

**Features:**

- Personal goal setting interface
- Progress tracking with visual indicators
- Deadline reminders
- Achievement rewards for completed goals
- Suggested goals based on performance

## UI/UX Requirements

### Visual Design

- **Color Scheme:** Motivational and energetic (blues, greens, golds)
- **Typography:** Clear hierarchy with celebration fonts for achievements
- **Icons:** Consistent icon system (Lucide React)
- **Animations:** Smooth transitions and celebration effects
- **Responsive:** Mobile-first design with tablet optimization

### Interactive Elements

- **Hover Effects:** Badge previews, chart tooltips
- **Click Actions:** Badge detail modals, chart drill-downs
- **Loading States:** Skeleton screens for data fetching
- **Empty States:** Encouraging messages for new users
- **Celebration:** Confetti animations for new achievements

### Accessibility

- **ARIA Labels:** Screen reader support for all interactive elements
- **Keyboard Navigation:** Full keyboard accessibility
- **Color Contrast:** WCAG 2.1 AA compliance
- **Focus Management:** Clear focus indicators
- **Alt Text:** Descriptive alt text for achievement images

## Data Fetching & State Management

### API Routes

```typescript
// Expected API endpoints
GET /api/student/achievements
GET /api/student/badges
GET /api/student/progress
GET /api/student/leaderboard
POST /api/student/goals
PUT /api/student/goals/:id
```

### Data Fetching Strategy

```typescript
// Use Next.js App Router data fetching
async function getAchievementData(userId: string) {
  // Fetch user achievements, badges, progress data
  // Implement caching for performance
  // Handle loading and error states
}
```

### Real-time Updates

- **WebSocket Integration:** Real-time badge notifications
- **Optimistic Updates:** Immediate UI feedback
- **Background Sync:** Periodic data refresh
- **Offline Support:** Cache critical achievement data

## Performance Optimization

### Loading Strategy

- **Lazy Loading:** Defer non-critical components
- **Code Splitting:** Split achievement components
- **Image Optimization:** Optimize badge and achievement images
- **Caching:** Cache API responses and static assets

### Bundle Size

- **Tree Shaking:** Remove unused chart components
- **Dynamic Imports:** Load charts only when needed
- **Asset Compression:** Optimize images and icons
- **CDN Integration:** Serve static assets from CDN

## Error Handling & Edge Cases

### Error Boundaries

```typescript
// Component: AchievementErrorBoundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
```

### Edge Cases

- **No Achievements:** Encouraging onboarding experience
- **Data Loading Errors:** Graceful fallbacks
- **Network Issues:** Offline mode indicators
- **Invalid Data:** Validation and sanitization
- **Performance Issues:** Progressive loading

## Implementation Steps

### Phase 1: Core Structure

1. Create page layout with header and navigation
2. Implement achievement overview cards
3. Add basic badge collection display
4. Create progress tracking charts

### Phase 2: Advanced Features

1. Add streak tracking and consistency metrics
2. Implement leaderboard functionality
3. Create goal setting interface
4. Add celebration animations

### Phase 3: Polish & Optimization

1. Implement real-time updates
2. Add accessibility features
3. Optimize performance
4. Add comprehensive error handling

## Testing Requirements

### Unit Tests

- Badge calculation logic
- Progress tracking algorithms
- Goal completion validation
- Chart data transformation

### Integration Tests

- API endpoint integration
- Database query optimization
- Real-time update functionality
- Error handling scenarios

### User Testing

- Achievement motivation effectiveness
- Navigation and usability
- Performance on various devices
- Accessibility compliance

## Success Metrics

### Engagement Metrics

- Time spent on achievement page
- Badge collection completion rate
- Goal setting and completion rate
- Leaderboard interaction frequency

### Performance Metrics

- Page load time < 2 seconds
- Chart rendering time < 1 second
- Real-time update latency < 500ms
- Mobile performance score > 90

## Additional Considerations

### Security

- **Data Privacy:** Protect student performance data
- **API Security:** Validate all achievement requests
- **Input Sanitization:** Prevent XSS in user-generated content
- **Rate Limiting:** Prevent achievement farming

### Scalability

- **Database Optimization:** Efficient achievement queries
- **Caching Strategy:** Redis for frequently accessed data
- **CDN Integration:** Global asset delivery
- **Load Testing:** Simulate high concurrent users

### Maintenance

- **Code Documentation:** Comprehensive component documentation
- **Type Safety:** Strong TypeScript typing
- **Error Logging:** Comprehensive error tracking
- **Performance Monitoring:** Real-time performance metrics

## Implementation Notes for Cursor AI

1. **Start with the basic page structure** and navigation
2. **Implement data fetching** with proper TypeScript types
3. **Create reusable components** for badges, charts, and cards
4. **Add animations and interactions** progressively
5. **Ensure responsive design** across all screen sizes
6. **Implement proper error handling** for all edge cases
7. **Add accessibility features** from the beginning
8. **Optimize for performance** with lazy loading and caching
9. **Include comprehensive testing** for all functionality
10. **Document all components** and their props thoroughly

Focus on creating an engaging, motivational experience that encourages students to continue learning while providing meaningful insights into their progress and achievements.
