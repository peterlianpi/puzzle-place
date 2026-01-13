import "server-only";

export interface LogData {
  type: "system" | "monitor" | "token" | "auth";
  message: string;
  userId?: string;
  level: "info" | "warn" | "error";
  action?: string;
  details?: string;
}

export class Logger {
  private static shouldLog(level: "info" | "warn" | "error"): boolean {
    const env = process.env.NODE_ENV;
    if (env === "development") return true;
    if (env === "production") return level === "warn" || level === "error";
    return false; // test or other environments
  }

  static async log(data: LogData) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[${data.level.toUpperCase()}] ${data.type}: ${data.message}`
      );
      return;
    }

    try {
      const { prisma } = await import("@/lib/db/prisma");
      await prisma.log.create({
        data: {
          type: data.type,
          message: data.message,
          userId: data.userId,
          level: data.level,
          action: data.action,
          details: data.details,
        },
      });
    } catch (error) {
      // Fallback to console logging if database logging fails
      console.error("Failed to log to database:", error);
      console.log(
        `[${data.level.toUpperCase()}] ${data.type}: ${data.message}`
      );
    }
  }

  static async info(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("info")) {
      await this.log({
        type: "system",
        level: "info",
        message,
        ...data,
      });
    }
  }

  static async warn(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("warn")) {
      await this.log({
        type: "monitor",
        level: "warn",
        message,
        ...data,
      });
    }
  }

  static async error(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("error")) {
      await this.log({
        type: "system",
        level: "error",
        message,
        ...data,
      });
    }
  }

  static async auth(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("info")) {
      await this.log({
        type: "auth",
        level: "info",
        message,
        ...data,
      });
    }
  }

  static async token(message: string, data?: Partial<LogData>) {
    if (this.shouldLog("info")) {
      await this.log({
        type: "token",
        level: "info",
        message,
        ...data,
      });
    }
  }

  static devLog(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV === "development") {
      console.log(message, ...args);
    }
  }
}
