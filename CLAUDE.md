# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AMOREA Brain Care** - A brain health habit platform for 50-60 year old pre-seniors.
- Domain: amorea.kr/brain
- Philosophy: "알지 말고, 관리하자" (Don't diagnose, just manage) - maintain brain health through habits without anxiety-inducing tests

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript strict mode
- **Styling**: Tailwind CSS with VitalBeautie brand colors
- **Hosting**: Cloudflare Pages (`@cloudflare/next-on-pages`)
- **Database/Auth**: Supabase (PostgreSQL + Google/Kakao OAuth)
- **AI**: OpenAI API (gpt-4o-mini) for personalized messages
- **Analytics**: Google Analytics 4
- **State**: Zustand for client state

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production (Cloudflare Pages)
npm run build

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

## Critical Constraints: Cloudflare Pages Edge Runtime

All server code must be Edge Runtime compatible:
- Add `export const runtime = 'edge'` to all API routes
- **Cannot use**: `fs`, `path`, `crypto` (Node.js), or any Node.js-only modules
- Supabase client (`@supabase/supabase-js`) is Edge compatible

## Project Structure

```
src/
├── app/
│   ├── brain/                    # Main brain care section
│   │   ├── page.tsx              # Landing (hero + counselor + games)
│   │   ├── test/                 # Brain age test (3-step)
│   │   ├── result/               # Results (brain age + percentile)
│   │   ├── games/                # Daily brain games
│   │   ├── habits/               # Habit tracker
│   │   └── dashboard/            # Personal dashboard
│   ├── counselor/                # Counselor system
│   ├── admin/                    # Admin dashboard
│   └── api/                      # Edge API routes
├── components/
│   ├── ui/                       # Common UI (Button, Card, Modal)
│   └── brain/                    # Brain-specific components
├── lib/
│   ├── supabase/                 # Supabase clients
│   └── analytics.ts              # GA4 tracking
└── types/
    └── database.ts               # Supabase types
```

## Brand Colors (Tailwind)

```
vb-black: #1A1A1A      vb-coral: #E8625C (CTA)
vb-navy: #1A1A2E       vb-teal: #3AAFA9 (health)
vb-green: #5D8A6B      vb-gold: #C8956C
vb-blue: #5C6BC0       vb-bg: #FAFAF7
```

## Key Conventions

- **5060 Usability**: Large touch targets (min 48px), high contrast
- **Mobile First**: Max container 430px
- **RSC First**: Minimize `'use client'`
- **Korean UI**: All user-facing text in Korean
- **No diagnosis language**: Use "뇌나이" as fun metric only

## Environment Variables

See `.env.local.example` for required variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_KAKAO_JS_KEY`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
