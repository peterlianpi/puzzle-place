/* eslint-disable @typescript-eslint/no-unused-vars */

import { Hono } from "hono";
import { handle } from "hono/vercel";
import users from "./users";
import events from "./events";
import myEvents from "./my-events";
import authUser from "./auth-user";
import avatar from "./avatar";
import testimonials from './testimonials'
// import uploadImage from "./upload-image";

const app = new Hono().basePath("/api");

// Security headers middleware
app.use('*', async (c, next) => {
  await next();
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'");
});

const routes = app
  // .route("/upload-image", uploadImage)
  .route("/users", users)
  .route("/events", events)
  .route("/my-events", myEvents)
  .route("/auth-user", authUser)
  .route("/avatar", avatar)
  .route("/testimonials",testimonials)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof routes;
