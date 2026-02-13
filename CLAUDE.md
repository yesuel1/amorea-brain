# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AMOREA Brain Care** - A brain health habit platform for 50-60 year old pre-seniors.
- Domain: amorea.kr/brain
- Philosophy: "알지 말고, 관리하자" (Don't diagnose, just manage) - maintain brain health through habits without anxiety-inducing tests

For detailed specifications, see `../PROJECT_SPEC.md` and `../SKILL.md`.

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
src/
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
