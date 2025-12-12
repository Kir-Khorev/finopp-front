# FinAInce — AI Финансовый Советник

AI-powered приложение для персональных финансовых рекомендаций на базе Groq Llama 3.3 70B.

## О проекте

FinAInce помогает решать финансовые проблемы через простой опрос из 4 вопросов. На основе ответов AI генерирует персональный финансовый план с конкретными рекомендациями по улучшению финансового благополучия.

### Основной функционал

- 🤖 AI-анализ финансовой ситуации через backend API
- 📊 Визуализация бюджета и расходов
- 💡 Персональные рекомендации по оптимизации финансов
- 📈 Интерактивные графики доходов/расходов/сбережений
- 📥 Экспорт результатов в Excel
- 🔄 Fallback на локальный mock если API недоступен

## Стек технологий

- **Frontend**: React 18 + TypeScript + Vite
- **UI Kit**: shadcn/ui + Radix UI
- **Стилизация**: Tailwind CSS
- **Формы**: React Hook Form + Zod
- **Графики**: Recharts
- **Роутинг**: React Router v6
- **State Management**: TanStack Query
- **Экспорт**: xlsx
- **Backend**: Go (Echo) + Groq AI

## Быстрый старт

### Prerequisites

- Node.js 20+
- Backend API running (см. `../finopp-back`)

### Installation & Run

```bash
# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env
# Или вручную создать .env:
# VITE_API_URL=http://localhost:8080

# Запустить dev-сервер
npm run dev
```

Frontend будет доступен на **http://localhost:5173**

### Environment Variables

Создайте `.env` файл для локальной разработки:

```env
VITE_API_URL=http://localhost:8080
```

**Важно:** 
- `.env` в `.gitignore` — не коммитьте его!
- Для **продакшена на Vercel** установите `VITE_API_URL=https://finopp-back.onrender.com` через Dashboard (см. раздел Deployment)

---

## 📁 Структура проекта

```
finopp-front/
├── src/
│   ├── components/
│   │   ├── auth/           # Компоненты авторизации
│   │   ├── finance/        # Финансовые компоненты (опросник, графики, результаты)
│   │   └── ui/             # UI библиотека (shadcn)
│   ├── pages/              # Страницы приложения
│   │   └── Index.tsx       # Главная страница
│   ├── services/           # API сервисы
│   │   ├── financeApi.ts   # Интеграция с backend
│   │   └── authApi.ts      # Авторизация
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Контекст авторизации
│   ├── types/              # TypeScript типы
│   │   └── finance.ts      # Типы для финансовых данных
│   ├── utils/              # Утилиты
│   │   ├── exportUtils.ts  # Экспорт в Excel
│   │   └── financeHelpers.ts # Fallback логика
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
├── .env.example           # Пример env переменных
├── index.html             # Entry point
├── vite.config.ts         # Vite конфигурация
└── package.json           # Dependencies
```

---

## 🔌 API Integration

Frontend взаимодействует с backend через REST API:

**Endpoint:** `POST /api/v1/advice`

**Request:**
```json
{
  "question": "Детальный анализ финансовой ситуации..."
}
```

**Response:**
```json
{
  "answer": "AI-generated рекомендации..."
}
```

**Fallback:** Если API недоступен, используется локальный mock-генератор.

---

## 🛠️ Development

### Available Commands

```bash
# Development server с hot-reload
npm run dev

# Production build
npm run build

# Dev build
npm run build:dev

# Превью продакшн билда
npm run preview

# Линтинг
npm run lint
```

### Tech Stack Details

- **Framework:** Vite 5 + React 18 (SPA)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **State:** React useState + TanStack Query
- **HTTP:** Fetch API
- **AI Backend:** Groq Llama 3.3 70B

---

## 🧩 Key Features

- ✅ Real-time финансовый анализ через AI (Groq Llama 3.3 70B)
- ✅ JWT авторизация с backend
- ✅ Структурированный опросник с валидацией (React Hook Form + Zod)
- ✅ Визуализация данных (Recharts)
- ✅ Экспорт результатов в Excel
- ✅ Responsive design (mobile-first)
- ✅ Error handling & loading states
- ✅ Fallback на локальную логику если API недоступен

---

## ⚠️ Common Issues

### Port 5173 already in use

```bash
# Kill process on port 5173
lsof -ti :5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### API not responding

1. Check `.env` has correct `VITE_API_URL`
2. Verify backend is running: `cd ../finopp-back && go run cmd/api/main.go`
3. Check backend health: `curl http://localhost:8080/health`
4. Restart frontend after changing `.env`

### Changes not reflecting

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Win)
- Clear cache: DevTools → Network → Disable cache
- Restart dev server

---

## 🚀 Deployment (Vercel)

### Build Settings

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Environment Variables

**ВАЖНО:** В Vercel Dashboard → Settings → Environment Variables добавь:

```
Name: VITE_API_URL
Value: https://finopp-back.onrender.com
Environment: Production ✅
```

**Без этой переменной фронт будет пытаться обращаться к localhost!**

После добавления переменной сделай **Redeploy** через Vercel Dashboard или пуш в GitHub.

---

## 📝 Notes for Developers

- **Vite** использует `import.meta.env` для env переменных
- Все env должны начинаться с `VITE_`
- **API интеграция:** `src/services/financeApi.ts`
- **Fallback логика:** `src/utils/financeHelpers.ts` (если backend недоступен)
- **Авторизация:** JWT токены через `AuthContext`
- **State management:** React Context + TanStack Query
- **Backend API:** репозиторий `../finopp-back`
