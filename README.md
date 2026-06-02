# AetherScope — Frontend

Next.js 15 frontend for the AetherScope AI Observability Platform.

## Setup

```bash
npm install

cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL (e.g. http://localhost:4000)

npm run dev
# Runs on http://localhost:3000
```

## Pages

| Route | Description |
|---|---|
| `/` | Home page |
| `/login` | Login |
| `/signup` | Registration |
| `/chat` | Live LLM chat console |
| `/conversations` | Conversation history |
| `/conversations/[id]` | Single conversation view |
| `/dashboard` | Analytics and metrics |
| `/anomalies` | Anomaly detection |
| `/profile` | User profile settings |

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS
- Recharts
- Zustand
- React Hook Form
- Axios

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
```
