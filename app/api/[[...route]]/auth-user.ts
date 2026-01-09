import { Hono } from "hono";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/api-errors";

const app = new Hono()
  // Get User
  .get("/get-user", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  })

  // Set Username
  .post("/set-username", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.user?.id) {
      return c.json({ error: "Please log in to set your username" }, 401);
    }

    const { username } = await c.req.json();

    if (!username || typeof username !== "string") {
      return c.json({ error: "Username is required" }, 400);
    }

    // Check if username is unique
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return c.json({ error: "Username already taken" }, 409);
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username: username.toLowerCase() },
      select: { id: true, username: true },
    });

    return c.json({ success: true, user: updatedUser });
  })

  // Check Username
  .post("/check-username", async (c) => {
    const { username } = await c.req.json();

    if (!username || typeof username !== "string") {
      return c.json({ error: "Username is required" }, 400);
    }

    // Sanitize and validate input
    const sanitizedUsername = username.trim().toLowerCase();

    if (sanitizedUsername.length < 3 || sanitizedUsername.length > 20) {
      return c.json({ error: "Username must be 3-20 characters" }, 400);
    }

    if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
      return c.json({ error: "Username contains invalid characters" }, 400);
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: sanitizedUsername },
    });

    return c.json({ available: !existingUser });
  })

  .onError((error, c) => handleApiError(c, error));

export default app;
