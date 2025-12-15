import { trackEvent, FinanceEvents } from './analytics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * БЕЗОПАСНОСТЬ:
 * - Пароли отправляются в plain text, но ТОЛЬКО через HTTPS (в продакшене)
 * - HTTPS шифрует весь трафик, включая body запроса
 * - На бэкенде пароль сразу хэшируется через bcrypt перед сохранением в БД
 * - В БД хранится только хэш, не сам пароль
 * - Локально (http://localhost) пароли не защищены - используйте только для разработки!
 */

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));

    // Преобразуем ошибки в понятные сообщения
    let message = error.error || 'Ошибка регистрации';

    if (message.includes('email already registered')) {
      message = 'Этот email уже зарегистрирован';
    } else if (message.includes('password must be at least 6')) {
      message = 'Пароль должен быть минимум 6 символов';
    } else if (message.includes('email and password are required')) {
      message = 'Заполните все поля';
    }

    throw new Error(message);
  }

  const result = await response.json();

  // Трекинг успешной регистрации
  trackEvent(FinanceEvents.USER_REGISTERED, {
    userId: result.user.id,
  });

  return result;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));

    let message = error.error || 'Ошибка входа';

    if (message.includes('invalid credentials')) {
      message = 'Неверный email или пароль';
    } else if (message.includes('email and password are required')) {
      message = 'Заполните все поля';
    }

    throw new Error(message);
  }

  return response.json();
};

// Сохранение токена в localStorage
export const saveAuth = (token: string, user: AuthResponse['user']) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Получение токена
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Получение пользователя
export const getUser = (): AuthResponse['user'] | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Выход
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};


