# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # First-time setup: install deps + Prisma generate + migrations
npm run dev         # Start dev server on http://localhost:3000 (uses Turbopack)
npm run build       # Production build
npm run test        # Run all tests (Vitest)
npm run db:reset    # Reset SQLite database
```

## Architecture

UIGen is a Next.js 15 app that generates React components via Claude AI with live preview.

### Core Concept
All generated code lives in an **in-memory virtual file system** (`src/lib/file-system.ts`) — nothing is written to disk. The AI operates on this VFS via two tools: `str_replace_editor` (text editing) and `file_manager` (file operations).

### Key Data Flow
1. User sends message → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Route calls Claude with tools via Vercel AI SDK `streamText`
3. Claude calls tools → tool results update the VFS via `FileSystemContext`
4. `PreviewFrame` re-renders live with the updated files

### Important Files
- `src/app/api/chat/route.ts` — AI streaming endpoint; Claude tools defined here; max 40 steps
- `src/lib/file-system.ts` — VirtualFileSystem class (in-memory, serializable)
- `src/lib/provider.ts` — Returns Claude Haiku (`claude-haiku-4-5`) or MockLanguageModel (no API key)
- `src/lib/contexts/chat-context.tsx` — `useChat` hook wiring; handles tool call dispatch
- `src/lib/contexts/file-system-context.tsx` — VFS state; executes tool calls from AI
- `src/lib/prompts/generation.tsx` — System prompt for the AI
- `src/lib/tools/str-replace.ts` / `file-manager.ts` — Tool implementations

### Auth & Persistence
- JWT auth via `jose` (HttpOnly cookies, 7-day expiry) — `src/lib/auth.ts`
- Prisma + SQLite — schema defined in `prisma/schema.prisma`:
  - `User`: `id`, `email` (unique), `password` (bcrypt), timestamps
  - `Project`: `id`, `name`, `userId?` (nullable for anonymous), `messages` (JSON array), `data` (JSON object), timestamps; cascades delete from User
- Anonymous users: session storage only; registered users: DB persistence

### UI Layout
`main-content.tsx`: resizable panels — Chat (35% left) | Preview+Code tabs (65% right). Code view splits FileTree (30%) and Monaco editor (70%).

### Environment
```
ANTHROPIC_API_KEY=""  # Optional — leave empty to use mock provider
```
Mock provider generates demo components (Counter, ContactForm, Card) without an API key.

### Path Aliases
`@/*` maps to `src/*`

### Testing
Tests use Vitest + jsdom + React Testing Library. Test files are colocated in `__tests__/` folders next to the code they test.
