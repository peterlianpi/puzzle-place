import { prisma } from "@/lib/db/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { handleApiError } from "@/lib/api-errors";
import { Logger } from "@/lib/logger";
import { auth } from "@/lib/auth/auth";

const profileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  isProfilePublic: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  showStats: z.boolean().optional(),
  showActivity: z.boolean().optional(),
  allowDataExport: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  securityEmails: z.boolean().optional(),
});

const app = new Hono()

  // Get profile settings
  .get("/", async (c) => {
    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          bio: true,
          theme: true,
          language: true,
          timezone: true,
          isProfilePublic: true,
          showEmail: true,
          showStats: true,
          showActivity: true,
          allowDataExport: true,
          marketingEmails: true,
          securityEmails: true,
          emailVerified: true,
        },
      });

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ profile: user });
    } catch (error) {
      await Logger.error("Get profile settings error", { details: String(error) });
      return c.json({ error: "Internal server error" }, 500);
    }
  })

  // Update profile settings
  .patch(
    "/",
    zValidator("json", profileUpdateSchema),
    async (c) => {
      try {
        const session = await auth.api.getSession({ headers: c.req.raw.headers });
        if (!session) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const data = c.req.valid("json");

        const updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data,
          select: {
            id: true,
            bio: true,
            theme: true,
            language: true,
            timezone: true,
            isProfilePublic: true,
            showEmail: true,
            showStats: true,
            showActivity: true,
            allowDataExport: true,
            marketingEmails: true,
            securityEmails: true,
            emailVerified: true,
          },
        });

        return c.json({ profile: updatedUser }, 200);
      } catch (error) {
        await Logger.error("Update profile settings error", { details: String(error) });
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )

  // Export user data
  .get("/export", async (c) => {
    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          theme: true,
          language: true,
          timezone: true,
          isProfilePublic: true,
          showEmail: true,
          showStats: true,
          showActivity: true,
          allowDataExport: true,
          marketingEmails: true,
          securityEmails: true,
          createdAt: true,
          updatedAt: true,
          // Include game history and events
          createdEvents: {
            select: {
              EventID: true,
              EventName: true,
              Description: true,
              CreatedAt: true,
            },
          },
          gameHistories: {
            select: {
              HistoryID: true,
              EventID: true,
              WonPrizeName: true,
              WonPrizeValue: true,
              PlayedAt: true,
            },
          },
        },
      });

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          ...user,
          email: user.showEmail ? user.email : "[REDACTED]",
        },
        metadata: {
          exportedBy: "Puzzle Place",
          version: "1.0",
          note: "This data export includes your profile information and activity history.",
        },
      };

      return c.json(exportData);
    } catch (error) {
      await Logger.error("Export user data error", { details: String(error) });
      return c.json({ error: "Internal server error" }, 500);
    }
  })

  .onError((error, c) => handleApiError(c, error));

export default app;