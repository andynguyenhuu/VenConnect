# VenConnect Project Context for Claude Code

## Project Overview
VenConnect is an enterprise web platform enabling teams in Vietnam and Australia to access Claude 4 Sonnet via Replicate API, with full compliance for both jurisdictions.

## Current Implementation Status

### ✅ Completed
1. **Frontend UI** - All components built with shadcn/ui
2. **Database Schema** - Complete Supabase schema in `/supabase/schema.sql`
3. **TypeScript Types** - Database types in `/types/database.ts`
4. **Service Layer** - Supabase services in `/lib/supabase/services.ts`
5. **Mock Data** - All features work with mock data

### ❌ Not Implemented
1. **Authentication** - Supabase Auth not connected
2. **Replicate API** - No integration with Claude 4 Sonnet
3. **Real Database** - Supabase not connected
4. **API Routes** - No backend endpoints
5. **File Uploads** - UI only, no actual uploads

## Key Files to Know

### Configuration
- `.env.example` - All required environment variables
- `package.json` - Dependencies installed
- `next.config.js` - Multi-region configuration

### UI Components
- `/components/chat/chat-interface.tsx` - Main chat UI (uses mock data)
- `/components/admin/` - Admin dashboard components
- `/components/layout/` - Header and sidebar

### Database
- `/supabase/schema.sql` - Complete PostgreSQL schema
- `/lib/supabase/client.ts` - Browser client (ready)
- `/lib/supabase/server.ts` - Server client (ready)
- `/lib/supabase/services.ts` - All database operations

### Pages
- `/app/page.tsx` - Landing page
- `/app/(dashboard)/chat/page.tsx` - Chat interface
- `/app/(dashboard)/admin/page.tsx` - Admin dashboard
- `/app/(dashboard)/layout.tsx` - App layout

## Environment Variables Needed
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Replicate
REPLICATE_API_TOKEN=your-replicate-token
REPLICATE_MODEL_VERSION=anthropic/claude-4-sonnet
```

## Next Implementation Steps

### 1. Connect Supabase
```bash
# 1. Create project at https://app.supabase.com (Sydney region)
# 2. Add credentials to .env.local
# 3. Run /supabase/schema.sql in SQL editor
# 4. Create 'attachments' storage bucket
```

### 2. Implement Auth Flow
```typescript
// Create these pages:
// - /app/(auth)/login/page.tsx
// - /app/(auth)/signup/page.tsx
// - /app/auth/callback/route.ts
// Update /components/layout/header.tsx to use real auth
```

### 3. Create Replicate Integration
```typescript
// Create /lib/replicate/client.ts
// Key endpoints:
// - https://api.replicate.com/v1/models/anthropic/claude-4-sonnet
// - Handle streaming responses
// - Track token usage
```

### 4. Create API Routes
```typescript
// /app/api/chat/route.ts - Handle messages
// /app/api/conversations/route.ts - CRUD operations
// /app/api/upload/route.ts - File handling
// /app/api/usage/route.ts - Track API calls
```

### 5. Wire Up Real Data
Replace mock data in:
- `/components/chat/chat-interface.tsx` - Use messageService
- `/components/chat/conversation-sidebar.tsx` - Use conversationService
- `/components/admin/user-management-table.tsx` - Use userService
- `/components/admin/usage-chart.tsx` - Use usageService

### 6. Implement Real-time
```typescript
// In chat-interface.tsx:
useEffect(() => {
  const unsubscribe = messageService.subscribeToMessages(
    conversationId,
    (message) => setMessages(prev => [...prev, message])
  )
  return unsubscribe
}, [conversationId])
```

## Architecture Decisions

### Frontend
- **Next.js 14 App Router** - Latest React features
- **shadcn/ui** - Customizable component library
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Client state management
- **React Query** - Server state management

### Backend
- **Supabase** - PostgreSQL + Auth + Storage + Realtime
- **Replicate API** - Access to Claude 4 Sonnet
- **Edge Functions** - Optional for API proxy

### Security
- **Row Level Security** - Database isolation
- **MFA Required** - Two-factor authentication
- **API Key Rotation** - Every 90 days
- **Audit Logging** - All API calls tracked

## Multi-Region Setup
- **Primary**: AWS Sydney (Australia compliance)
- **Secondary**: AWS Singapore (Vietnam performance)
- **Currency**: AUD/VND with 17,150 exchange rate
- **Timezone**: Automatic detection with manual override

## Development Commands
```bash
npm run dev          # Start dev server (port 3000/3001)
npm run build        # Production build
npm run lint         # Run ESLint
./dev.sh [command]   # Development helper
./setup-supabase.sh  # Supabase setup wizard
```

## Testing Approach
1. **Unit Tests** - Components with React Testing Library
2. **Integration Tests** - API routes with Supertest
3. **E2E Tests** - Critical flows with Playwright
4. **Load Tests** - 100+ concurrent users with K6

## Performance Targets
- Response time: <200ms (95th percentile)
- Uptime: 99.5% SLA
- Max file size: 10MB
- Context window: 200k tokens

## Compliance Requirements
- **Australia**: APP compliance, data in Sydney
- **Vietnam**: Data localisation, server in region
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Audit**: All actions logged with timestamps

## Current Issues/Blockers
1. Dev server running on port 3001 (3000 in use)
2. No actual API keys configured
3. Database not connected
4. Auth not implemented

## Contact
- Project: VenConnect
- Owner: Andy Nguyen (andy@ven.com.au)
- Location: Melbourne, Victoria, AU

---

This context file should be referenced when implementing new features. All UI components are complete and functional with mock data - focus on connecting the backend services.
