import { initAll, track, identify, setUserId } from '@amplitude/unified';
import { Identify } from '@amplitude/analytics-browser';

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY || '';

let isInitialized = false;

export const initAnalytics = () => {
  if (!AMPLITUDE_API_KEY) {
    console.warn('Amplitude API key not found. Analytics will not be initialized.');
    return;
  }

  if (isInitialized) {
    return;
  }

  try {
    initAll(AMPLITUDE_API_KEY, {
      serverZone: 'US',

      // Analytics с автокапчуром
      analytics: {
        defaultTracking: {
          sessions: true,
          pageViews: true,
          formInteractions: true,
          fileDownloads: true,
        },
      },

      // Session Replay для отладки UX
      sessionReplay: {
        sampleRate: 0.3, // 30% сессий для финтеха достаточно
      },
    });

    isInitialized = true;
    console.log('✅ Amplitude initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Amplitude:', error);
  }
};

// Трекинг событий
export const trackEvent = (eventName: string, eventProperties?: Record<string, unknown>) => {
  if (!isInitialized) return;

  try {
    track(eventName, eventProperties);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Идентификация пользователя
export const identifyUser = (userId: string, userProperties?: Record<string, unknown>) => {
  if (!isInitialized) return;

  try {
    setUserId(userId);

    if (userProperties) {
      const identifyObj = new Identify();
      Object.entries(userProperties).forEach(([key, value]) => {
        identifyObj.set(key, value);
      });
      identify(identifyObj);
    }
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
};

// Предопределенные события для финансового приложения
export const FinanceEvents = {
  // Авторизация
  USER_REGISTERED: 'User Registered',
  USER_LOGGED_IN: 'User Logged In',
  USER_LOGGED_OUT: 'User Logged Out',

  // Опросник
  QUESTIONNAIRE_STARTED: 'Questionnaire Started',
  QUESTIONNAIRE_COMPLETED: 'Questionnaire Completed',

  // Генерация советов
  ADVICE_GENERATION_STARTED: 'Advice Generation Started',
  ADVICE_GENERATION_SUCCESS: 'Advice Generation Success',
  ADVICE_GENERATION_FAILED: 'Advice Generation Failed',

  // Взаимодействие с результатами
  ADVICE_VIEWED: 'Advice Viewed',
  ADVICE_EXPORTED_EXCEL: 'Advice Exported Excel',
  ADVICE_EXPORTED_PDF: 'Advice Exported PDF',
  RECOMMENDATION_EXPANDED: 'Recommendation Expanded',

  // Навигация
  RESET_TO_QUESTIONNAIRE: 'Reset to Questionnaire',
} as const;

