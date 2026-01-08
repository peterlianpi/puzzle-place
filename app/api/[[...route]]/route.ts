/* eslint-disable @typescript-eslint/no-unused-vars */

import { Hono } from "hono";
import { handle } from "hono/vercel";
import users from "./users";
import events from "./events";
import myEvents from "./my-events";
import prizes from "./prizes";
// import uploadImage from "./upload-image";

const app = new Hono().basePath("/api");

const routes = app
  // .route("/upload-image", uploadImage)
  .route("/users", users)
  .route("/events", events)
  .route("/my-events", myEvents)
  .route("/prizes", prizes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof routes;
