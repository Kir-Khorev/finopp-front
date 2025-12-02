# Finopp Frontend

Next.js 16 web application for financial advisory chat powered by AI.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Backend API running on http://localhost:8080

### Installation & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at **http://localhost:3000**

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Important:** `.env.local` is in `.gitignore` - never commit it!

---

## 📁 Project Structure

```
finopp-front/
├── app/                    # Next.js 16 App Router
│   ├── page.tsx           # Main chat page (homepage)
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── register/          # Registration page
│   │   └── page.tsx
│   └── api/               # API routes (currently unused)
│
├── public/                # Static assets
├── .env.local            # Environment variables (create manually)
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS config
└── package.json          # Dependencies
```

---

## 🛠️ Development

### Available Commands

```bash
# Development server with hot-reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React useState + localStorage
- **HTTP:** Fetch API

---

## 🔌 API Integration

Frontend communicates with backend via REST API:

**Endpoint:** `POST /api/v1/advice`

**Request:**
```json
{
  "question": "Что такое финансовая грамотность?"
}
```

**Response:**
```json
{
  "answer": "Финансовая грамотность — это..."
}
```

---

## 🧩 Key Features

- ✅ Real-time chat with AI (Groq Llama 3.3 70B)
- ✅ Message history saved in localStorage
- ✅ Responsive design (mobile-first)
- ✅ Error handling & loading states
- ✅ Clear history button

---

## ⚠️ Common Issues

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### API not responding

1. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Verify backend is running on http://localhost:8080
3. Check backend health: `curl http://localhost:8080/health`
4. Restart frontend after changing `.env.local`

### Changes not reflecting

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Win)
- Clear localStorage: Open DevTools → Application → Local Storage → Clear
- Restart dev server

---

## 📝 Notes for Developers

- All pages are **client components** (`"use client"`)
- Chat history persists in **localStorage** (key: `finopp-chat-history`)
- API URL must start with `NEXT_PUBLIC_` to be available in browser
- Turbopack is used by default (faster than Webpack)
