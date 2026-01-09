import { Hono } from "hono";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/api-errors";
import { v2 as cloudinary } from "cloudinary";
import z from "zod";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = new Hono()

  // Upload Avatar
  .post("/upload", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.user?.id) {
      return c.json({ error: "Please log in to upload avatar" }, 401);
    }

    const body = await c.req.json();
    const { imageData } = body; // Expect base64 string

    if (!imageData || typeof imageData !== "string") {
      return c.json({ error: "Image data is required" }, 400);
    }

    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imageData, {
        folder: "puzzle-place/avatars",
        public_id: `user_${session.user.id}_${Date.now()}`,
        resource_type: "image",
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      });

      // Update user image in database
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: uploadResult.secure_url },
      });

      return c.json({
        success: true,
        imageUrl: uploadResult.secure_url
      });

    } catch (error) {
      console.error("Avatar upload error:", error);
      return c.json({ error: "Failed to upload avatar" }, 500);
    }
  })

  // Signature for client-side upload (if needed)
  .post("/signature", async (c) => {
    const body = await c.req.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return c.json({ signature });
  })

  .onError((error, c) => handleApiError(c, error));

export default app;
