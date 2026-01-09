import { Context } from "hono";

export function withApiErrorHandler(
  handler: (c: Context) => Promise<Response>
) {
  return async (c: Context) => {
    try {
      return await handler(c);
    } catch (error: unknown) {
      console.error("API error:", error);
      const err = error as { code?: string };
      if (err.code === "P1017" || err.code === "ECONNRESET") {
        return c.json(
          { error: "Database connection failed. Please try again later." },
          500
        );
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  };
}
