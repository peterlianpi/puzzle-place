import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

// Use empty string for same-origin API calls (works on Vercel and local)
export const client = hc<AppType>("");

