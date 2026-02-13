# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AMOREA Brain Care** - A brain health habit platform for 50-60 year old pre-seniors.
- Domain: amorea.kr/brain
- Philosophy: "알지 말고, 관리하자" (Don't diagnose, just manage) - maintain brain health through habits without anxiety-inducing tests
- Working directory: `amorea-brain/`

For detailed specifications, see `PROJECT_SPEC.md` and `SKILL.md`.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript strict mode
- **Styling**: Tailwind CSS 3 with VitalBeautie brand colors (`vb-*` classes)
- **Hosting**: Cloudflare Pages (`@cloudflare/next-on-pages`)
- **Database/Auth**: Supabase (PostgreSQL + Google/Kakao OAuth)
- **State**: Zustand for client state
- **AI**: OpenAI API (gpt-4o-mini) for personalized messages
- **Analytics**: Google Analytics 4

## Development Commands

```bash
cd amorea-brain

npm install              # Install dependencies
npm run dev              # Dev server at localhost:3000
npm run build            # Build for Cloudflare Pages
npm run lint             # ESLint check
npx tsc --noEmit         # TypeScript type check
npx supabase db push     # Apply Supabase migrations
```

## Critical Constraints: Cloudflare Pages Edge Runtime

All server code must be Edge Runtime compatible:
- Add `export const runtime = 'edge'` to all API routes
- **Cannot use**: `fs`, `path`, `crypto` (Node.js), or any Node.js-only modules
- **Cannot use**: Dynamic `require()`, `eval()`, or node-gyp native modules
- Supabase client (`@supabase/supabase-js`) is Edge compatible

## Architecture

```
amorea-brain/src/
├── app/
│   ├── brain/                    # Main brain care section
│   │   ├── page.tsx              # Landing (hero + counselor message + games)
│   │   ├── test/                 # Brain age test (3-step: memory/calc/focus)
│   │   ├── result/               # Results (brain age + percentile + share)
│   │   ├── games/                # Daily brain games (memory, calc, focus)
│   │   ├── habits/               # Habit tracker
│   │   └── dashboard/            # Personal dashboard (login required)
│   ├── counselor/                # Counselor system
│   │   ├── [code]/               # Counselor's personal landing page
│   │   └── dashboard/            # Client management (counselor only)
│   ├── admin/                    # Admin dashboard
│   └── api/                      # Edge API routes
│       ├── ai/message/           # OpenAI encouragement messages
│       └── auth/callback/        # OAuth callback
├── components/
│   ├── ui/                       # Reusable UI (Button, Card, Modal, ShareSheet)
│   └── brain/                    # Brain-specific components (games, habits)
├── lib/
│   ├── supabase/                 # Supabase clients (client.ts, server.ts, middleware.ts)
│   ├── analytics.ts              # GA4 event tracking
│   └── free-usage.ts             # Free trial tracking (localStorage)
├── types/
│   └── database.ts               # Supabase generated types
└── middleware.ts                 # Route protection (auth check)
```

## Key Data Flow

1. **Free → Signup**: 3 free uses (brain test + games) tracked via localStorage (`lib/free-usage.ts`), then signup modal
2. **Counselor Link**: `/counselor/[code]` → signup → auto-links user to counselor
3. **Brain Age**: Test 3 areas → calculate brain age (formula: `70 - avgScore × 0.45`) → show percentile vs peers

## Key Patterns

### Supabase Clients
- **Browser**: `lib/supabase/client.ts` — use in `'use client'` components
- **Server**: `lib/supabase/server.ts` — use in Server Components and API routes
- **Middleware**: `lib/supabase/middleware.ts` — session refresh

### Protected Routes (middleware.ts)
- `/brain/dashboard`, `/brain/habits` — user login required
- `/counselor/*` — counselor role required
- `/admin/*` — admin role required

## Brand Colors (Tailwind config)

```typescript
vb: {
  black: '#1A1A1A',      // Primary text
  navy: '#1A1A2E',       // Hero background
  coral: '#E8625C',      // CTA buttons, energy
  teal: '#3AAFA9',       // Health/care accent
  green: '#5D8A6B',      // Liver/metabolism products
  gold: '#C8956C',       // Ginseng products
  blue: '#5C6BC0',       // Focus/thinking
  bg: '#FAFAF7',         // Page background
}
```

## Conventions

- **5060 Usability**: Large touch targets (min 48px), high contrast, large text
- **Mobile First**: Max container 430px, responsive scaling
- **RSC First**: Minimize `'use client'`, use React Server Components
- **Korean UI**: All user-facing text in Korean, code in English
- **No diagnosis language**: Never use "치매 위험도", "진단" — use "뇌나이" as fun metric only

## Environment Variables

See `.env.local.example` for all required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server-side only
OPENAI_API_KEY=
NEXT_PUBLIC_KAKAO_JS_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_BASE_URL=https://amorea.kr
```

## Database Tables (Supabase)

Core tables: `profiles`, `counselors`, `brain_tests`, `game_records`, `habits`, `messages`, `products`, `page_content`, `share_links`

Schema: `supabase/migrations/001_initial_schema.sql`

---

## 🚨 TODO (다음 세션에서 확인 필요)

### 🔴 심각한 버그 수정 필요

1. **Auth Callback client_count 버그** (`src/app/auth/callback/route.ts`)
   - 현재: `.update({ client_count: counselor.id })` — UUID로 덮어씀!
   - 수정: `.update({ client_count: counselor.client_count + 1 })`

2. **OAuth 후 회원가입 리다이렉트 누락**
   - 현재: 콜백 후 `/auth/signup`으로 자동 이동 안 됨
   - 수정: 프로필 정보 없으면 `/auth/signup` 리다이렉트 추가

### 🟠 UX 개선 필요

3. **Role 기반 접근 제어 미완성** (`src/middleware.ts`)
   - `/counselor/*`, `/admin/*` 경로에서 role 체크 없음
   - 일반 사용자도 관리자 페이지 접근 가능 (보안 취약)

4. **getUser vs getSession 혼용**
   - 메인 페이지: `getUser()` (서버)
   - 테스트 페이지: `getSession()` (클라이언트)
   - 일관성 있게 통일 필요

5. **로그인 사용자 무료 횟수 처리**
   - 비로그인 상태에서 사용한 횟수는 로그인 후에도 복구 안 됨
   - 로그인 시 무료 횟수 리셋 고려

### 📝 참고사항
- Vercel 배포 URL: https://amorea-brain.vercel.app
- 카카오 로그인은 제거됨 (Google만 사용)
- 기억력 게임 난이도 선택 추가됨 (1단계 8장, 2단계 16장)
