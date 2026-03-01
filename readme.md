# NutriBot 🥗

**AI-powered personalized nutrition assistant** built with Next.js 15, Claude claude-sonnet-4-6, and the Vercel AI SDK.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vinaybudideti/Masters-Project)

---

## What it does

NutriBot is an intelligent nutrition chatbot that provides:

- **Personalized meal recommendations** based on your diet (vegan, keto, paleo, Mediterranean, etc.)
- **Real nutrition data** — accurate calories and macros fetched from the Nutritionix API
- **Agentic AI** — Claude claude-sonnet-4-6 autonomously calls nutrition tools to look up meal data before responding
- **Streaming responses** — answers appear in real-time as Claude generates them
- **Persistent preferences** — diet type, goals, and calorie targets saved to localStorage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS v3 + Framer Motion |
| State | Zustand with localStorage persistence |
| AI SDK | Vercel AI SDK v4 |
| LLM | Anthropic Claude claude-sonnet-4-6 |
| Nutrition Data | Nutritionix API |
| Deployment | Vercel |

---

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Claude streaming endpoint (agentic loop)
│   │   └── nutrition/route.ts   # Nutritionix proxy (API key secured server-side)
│   ├── chat/page.tsx            # Main chat UI
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ChatInterface.tsx        # Root layout: sidebar + chat
│   ├── MessageBubble.tsx        # Streaming message with markdown
│   ├── MessageInput.tsx         # Auto-resizing input with stop button
│   ├── NutritionCard.tsx        # Macro visualization cards
│   ├── QuickActions.tsx         # Conversation starters
│   ├── Sidebar.tsx              # Diet prefs, goals, calorie target
│   └── TypingIndicator.tsx
├── hooks/useNutritionChat.ts    # Wraps Vercel AI SDK useChat
├── lib/
│   ├── nutritionix.ts           # Vercel AI SDK tool definition
│   ├── system-prompt.ts         # Dynamic Claude system prompt
│   ├── types.ts
│   └── utils.ts
└── store/chatStore.ts           # Zustand store (persisted)
```

The API route at `/api/chat` uses `streamText` from the Vercel AI SDK with `maxSteps: 3`, enabling an **agentic loop** where Claude can:
1. Decide to search for nutrition data
2. Call the `searchNutrition` tool (backed by Nutritionix API)
3. Receive the results and craft a response with accurate macros
4. Stream the final answer to the user

---

## Local Development

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- (Optional) [Nutritionix API credentials](https://developer.nutritionix.com/)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/vinaybudideti/Masters-Project.git
cd Masters-Project

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Without `NUTRITIONIX_APP_ID` and `NUTRITIONIX_API_KEY`, the app uses estimated mock nutrition data. The chat still works fully — Claude just uses its built-in knowledge for nutrition estimates.

---

## Deploy to Vercel

### One-click deploy:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vinaybudideti/Masters-Project)

### Manual deploy:
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Add environment variables:
   - `ANTHROPIC_API_KEY` (required)
   - `NUTRITIONIX_APP_ID` (optional)
   - `NUTRITIONIX_API_KEY` (optional)
4. Click **Deploy**

Your app will be live in ~60 seconds at a `*.vercel.app` URL.

---

## Features

- **Streaming AI responses** — text streams in real-time via SSE
- **Agentic nutrition lookup** — Claude calls the Nutritionix API autonomously when it needs accurate data
- **Inline nutrition cards** — animated macro cards appear in chat alongside AI responses
- **Persistent preferences** — diet type, health goals, calorie targets, and restrictions saved across sessions
- **Dark glassmorphic UI** — modern 2026-style design with smooth Framer Motion animations
- **Mobile responsive** — collapsible sidebar for mobile
- **Zero-config fallback** — works without Nutritionix keys (uses estimated data)

---

## Legacy Code

The original Rasa NLU + Flask implementation is preserved in the `legacy/` directory for reference:
- `legacy/rasa/` — Rasa 3.6 NLU chatbot (training data, models, actions)
- `legacy/flask/` — Flask REST API middleware

The new architecture replaces both with Next.js API Route Handlers and Claude claude-sonnet-4-6.

---

## License

MIT © 2025 vinaybudideti
