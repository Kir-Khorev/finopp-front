# 🐛 Отладка Amplitude

## Проверка что события отправляются

### 1. Консоль браузера (Chrome DevTools)

Открой консоль (F12) и смотри логи:

```
🔄 Initializing Amplitude...
✅ Amplitude initialized successfully
📊 API Key: a1b2c3d4...
📤 Tracking event: User Registered { userId: 123 }
👤 Identifying user: 123 { email: 'test@test.com', name: 'Test User' }
```

Если видишь `⚠️ Amplitude not initialized yet` — значит события отправляются ДО завершения инициализации.

### 2. Network Tab (проверка HTTP запросов)

1. Открой DevTools → **Network**
2. Фильтр: `api2.amplitude.com` или `api.amplitude.com`
3. Выполни действие (логин, заполни форму)
4. Должны появиться запросы:
   - `POST https://api2.amplitude.com/2/httpapi`
   - `POST https://api2.amplitude.com/batch`

**Пример запроса:**
```json
{
  "api_key": "твой_ключ",
  "events": [{
    "event_type": "User Registered",
    "user_id": "123",
    "event_properties": {...}
  }]
}
```

### 3. Amplitude Debugger

Самый надёжный способ:

1. Открой консоль браузера
2. Выполни:
```javascript
window.amplitude.setDiagnosticsSampleRate(1);
```
3. Перезагрузи страницу
4. Amplitude будет показывать все события в консоли

### 4. User ID в идентификации

Проблема может быть в том, что `userId` — это number, а Amplitude ждёт string.

**В `AuthContext.tsx` проверь:**
```typescript
identifyUser(newUser.id, {...})  // ← если id это number, будет ошибка!
```

**Должно быть:**
```typescript
identifyUser(String(newUser.id), {...})
```

---

## Частые проблемы

### ❌ События не приходят

**Причина 1:** Неправильный API Key
- Проверь `.env.local` → `VITE_AMPLITUDE_API_KEY`
- Сравни с ключом в Amplitude → Settings → Projects → API Keys

**Причина 2:** Инициализация не завершилась
- События отправляются до `await initAll()`
- Смотри консоль: `⚠️ Amplitude not initialized yet`

**Причина 3:** userId неправильного типа
- Amplitude ждёт `string`, а мы отправляем `number`
- Фикс: `String(userId)`

**Причина 4:** Блокировка AdBlock/Privacy Badger
- Отключи блокировщики на localhost
- Проверь Network → должны быть запросы к `api2.amplitude.com`

### ❌ События есть в консоли, но не в Amplitude UI

**Причина:** Задержка обработки
- Amplitude обрабатывает события с задержкой 5-10 минут
- **Live Events** обновляется быстрее
- **Data → Events** может задерживаться до 1 часа

---

## Тестовый сценарий

1. Открой приложение
2. Открой DevTools → Console + Network
3. Зарегистрируйся
4. Смотри:
   - Console: `📤 Tracking event: User Registered`
   - Network: `POST https://api2.amplitude.com/2/httpapi` (Status 200)
5. Подожди 1-2 минуты
6. Amplitude → Live Events → обнови
7. Должно появиться событие `User Registered`

---

## Если ничего не помогло

Добавь в `analytics.ts`:

```typescript
export const debugAmplitude = () => {
  console.log('🔍 Amplitude Debug Info:');
  console.log('  Initialized:', isInitialized);
  console.log('  API Key:', AMPLITUDE_API_KEY);
  console.log('  Init Promise:', initPromise);
};
```

Вызови в консоли:
```javascript
window.debugAmplitude = () => { /* код выше */ };
debugAmplitude();
```

