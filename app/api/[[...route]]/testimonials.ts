import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { handleApiError } from "@/lib/api-errors";

const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  content: z.string().min(1, "Content is required"),
  avatar: z.string().optional(),
});

const updateTestimonialSchema = z
  .object({
    name: z.string().min(1).optional(),
    role: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    avatar: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .partial();

type CreateTestimonialRequest = z.infer<typeof createTestimonialSchema>;
type UpdateTestimonialRequest = z.infer<typeof updateTestimonialSchema>;

const app = new Hono()

  .post("/", zValidator("json", createTestimonialSchema), async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data: CreateTestimonialRequest = c.req.valid("json");
    const { name, role, content, avatar } = data;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        content,
        avatar,
      },
    });

    return c.json({ testimonial }, 201);
  })
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        limit: z.string().optional().default("20"),
        offset: z.string().optional().default("0"),
      })
    ),
    async (c) => {
      const { limit: limitStr, offset: offsetStr } = c.req.valid("query");
      const limit = parseInt(limitStr);
      const offset = parseInt(offsetStr);

      const testimonials = await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      const total = await prisma.testimonial.count({
        where: { isActive: true },
      });

      return c.json(
        {
          testimonials,
          pagination: {
            limit,
            offset,
            total,
            hasMore: offset + limit < total,
          },
        },
        {
          headers: {
            "Cache-Control": "public, max-age=300", // Cache for 5 minutes
          },
        }
      );
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", updateTestimonialSchema),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const data: UpdateTestimonialRequest = c.req.valid("json");

      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
      });
      if (!testimonial) {
        return c.json({ error: "Testimonial not found" }, 404);
      }

      const updated = await prisma.testimonial.update({
        where: { id },
        data,
      });

      return c.json({ testimonial: updated });
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

     const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Invalid ID" }, 400);
      }

      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
      });
      if (!testimonial) {
        return c.json({ error: "Testimonial not found" }, 404);
      }

      await prisma.testimonial.delete({
        where: { id },
      });

      return c.json({ message: "Testimonial deleted" });
    }
  )
  .onError((error, c) => handleApiError(c, error));

export default app;
