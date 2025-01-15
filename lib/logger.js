// Simple logger utility for both server and client
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (source, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      source,
      level: 'INFO',
      message,
      data,
    };

    if (isDev) {
      console.log(`[${source}]`, message, data);
    }

    // Store in memory (in production, use a service like Sentry)
    if (typeof window === 'undefined') {
      // Server-side
      global.appLogs = global.appLogs || [];
      global.appLogs.push(logEntry);
      if (global.appLogs.length > 1000) {
        global.appLogs = global.appLogs.slice(-500); // Keep last 500
      }
    } else {
      // Client-side - send to server
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      }).catch(() => {});
    }

    return logEntry;
  },

  error: (source, message, error = null) => {
    const timestamp = new Date().toISOString();
    const errorData = {
      message: error?.message,
      stack: error?.stack,
      ...error,
    };

    const logEntry = {
      timestamp,
      source,
      level: 'ERROR',
      message,
      data: errorData,
    };

    console.error(`[${source}]`, message, error);

    // Store in memory
    if (typeof window === 'undefined') {
      global.appLogs = global.appLogs || [];
      global.appLogs.push(logEntry);
      if (global.appLogs.length > 1000) {
        global.appLogs = global.appLogs.slice(-500);
      }
    } else {
      // Send to server
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      }).catch(() => {});
    }

    return logEntry;
  },

  warn: (source, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      source,
      level: 'WARN',
      message,
      data,
    };

    console.warn(`[${source}]`, message, data);

    if (typeof window === 'undefined') {
      global.appLogs = global.appLogs || [];
      global.appLogs.push(logEntry);
      if (global.appLogs.length > 1000) {
        global.appLogs = global.appLogs.slice(-500);
      }
    } else {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      }).catch(() => {});
    }

    return logEntry;
  },

  debug: (source, message, data = null) => {
    if (!isDev) return null;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      source,
      level: 'DEBUG',
      message,
      data,
    };

    console.debug(`[${source}]`, message, data);
    return logEntry;
  },

  getLogs: () => {
    return global.appLogs || [];
  },

  clearLogs: () => {
    global.appLogs = [];
  },
};
