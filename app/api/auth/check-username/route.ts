import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Sanitize and validate input
    const sanitizedUsername = username.trim().toLowerCase();

    if (sanitizedUsername.length < 3 || sanitizedUsername.length > 20) {
      return NextResponse.json({ error: "Username must be 3-20 characters" }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
      return NextResponse.json({ error: "Username contains invalid characters" }, { status: 400 });
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: sanitizedUsername },
    });

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error("Check username error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}