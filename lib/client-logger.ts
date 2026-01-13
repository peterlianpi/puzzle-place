/**
 * Client-side logger utility
 * Safe to use in client components without causing server-side import issues
 */

interface LogData {
  type: "system" | "monitor" | "token" | "auth" | "error";
  message: string;
  userId?: string;
  level: "info" | "warn" | "error";
  action?: string;
  details?: string;
}

class ClientLogger {
  private static shouldLog(level: "info" | "warn" | "error"): boolean {
    const env = process.env.NODE_ENV;
    if (env === "development") return true;
    if (env === "production") return level === "warn" || level === "error";
    return false; // test or other environments
  }

  static info(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("info")) {
      console.log(`[INFO] ${data?.type || "client"}: ${message}`, data);
    }
  }

  static warn(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] ${data?.type || "client"}: ${message}`, data);
    }
  }

  static error(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] ${data?.type || "client"}: ${message}`, data);
    }
  }

  static auth(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("info")) {
      console.log(`[AUTH] client: ${message}`, data);
    }
  }

  static token(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("info")) {
      console.log(`[TOKEN] client: ${message}`, data);
    }
  }

  // Always log in development, regardless of level
  static devLog(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] ${message}`, ...args);
    }
  }
}

export { ClientLogger };
export type { LogData };