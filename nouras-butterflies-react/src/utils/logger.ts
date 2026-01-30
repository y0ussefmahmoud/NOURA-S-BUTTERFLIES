type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

type LoggerConfig = {
  level: LogLevel;
};

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

const getDefaultLogLevel = (): LogLevel => {
  const envLevel = import.meta.env.VITE_LOG_LEVEL?.toLowerCase();
  if (envLevel && envLevel in LOG_LEVELS) {
    return envLevel as LogLevel;
  }

  return import.meta.env.PROD ? 'warn' : 'debug';
};

const config: LoggerConfig = {
  level: getDefaultLogLevel(),
};

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.level];
};

export const logger = {
  setLevel(level: LogLevel) {
    config.level = level;
  },
  debug(...args: unknown[]) {
    if (shouldLog('debug')) {
      console.debug(...args);
    }
  },
  info(...args: unknown[]) {
    if (shouldLog('info')) {
      console.info(...args);
    }
  },
  warn(...args: unknown[]) {
    if (shouldLog('warn')) {
      console.warn(...args);
    }
  },
  error(...args: unknown[]) {
    if (shouldLog('error')) {
      console.error(...args);
    }
  },
};

export type { LogLevel };
