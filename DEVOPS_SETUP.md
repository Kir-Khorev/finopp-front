# Frontend DevOps Setup

## Что создано

```
.github/workflows/
├── ci.yml              # Автопроверка (lint + build) при push
└── manual-deploy.yml   # Ручной деплой кнопкой
```

## Быстрый старт

1. **Запушить workflows** → GitHub Actions автоматом запустится

2. **Настроить секрет:**
   ```
   GitHub → Settings → Secrets → Add:
   Name:  VITE_API_URL
   Value: https://finopp-back.onrender.com
   ```

3. **Проверить:** GitHub → Actions → увидишь запуск ✅

4. **Ручной деплой:** Actions → "Manual Deploy" → Run workflow

## Что происходит

**CI (ci.yml):**
- Запускается: при push в main/develop, при PR, или руками
- Делает: checkout → install → lint → build
- Если ❌ → смотри логи в Actions

**Manual Deploy:**
- Запускается: только руками
- Делает: build → (опционально) deploy на Vercel

## Troubleshooting

**Workflow не запустился:**
```bash
ls -la .github/workflows/  # Проверь что файлы на месте
# Должны быть .yml (не .yaml)
```

**Build fails:**
```bash
npm run lint   # Проверь локально
npm run build  # Если работает локально → проверь секреты
```

**Secrets не работают:**
- Имя точно `VITE_API_URL` (регистр важен)
- Секрет в репозитории (не в аккаунте)

## Схема работы

```
git push → GitHub Actions проверяет
        → Если ✅ → main обновляется
        → Vercel видит изменения
        → Vercel деплоит
```

**Итого:** Vercel деплоит автоматом, Actions проверяет код перед merge.

