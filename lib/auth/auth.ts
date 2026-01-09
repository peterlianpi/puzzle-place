/* eslint-disable @typescript-eslint/no-unused-vars */
import { betterAuth } from "better-auth";
import type { User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/prisma";
import { sendEmail } from "../email";
import { emailTemplates } from "../email/templates";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),

  rateLimit: {
    window: 60 * 1000, // 1 minute
    max: 100, // Increased to allow more frequent session checks
    storage: "database", // Store rate limit data in database
  },

  emailAndPassword: {
    enabled: true,
    // Configure password reset token expiration
    resetPasswordTokenExpiresIn: 60 * 60 * 24, // 24 hours instead of default 1 hour
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(`Sending password reset email to user: ${user.email}, name: ${user.name}`);
      // Better Auth provides the API URL, but we need the frontend URL
      // Extract token from the API URL and construct frontend URL
      const tokenFromUrl = url.split("/reset-password/")[1]?.split("?")[0];
      const resetLink = `${
        process.env.BETTER_AUTH_URL || "http://localhost:3000"
      }/auth/reset-password?token=${tokenFromUrl || token}`;

      const template = emailTemplates.passwordReset({
        name: user.name,
        email: user.email,
        resetLink,
      });

      void sendEmail({
        to: user.email,
        subject: template.subject,
        text: `Click the link to reset your password: ${resetLink}`,
        html: template.html,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // Send notification email when password is changed
      const template = emailTemplates.passwordChanged({
        name: user.name,
        email: user.email,
      });

      void sendEmail({
        to: user.email,
        subject: template.subject,
        text: `Your Puzzle Place password has been changed. If you didn't make this change, please contact support immediately.`,
        html: template.html,
      });
    },
  },

  emailVerification: {
    // Allow verification without being logged in
    requireEmailConfirmation: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log(
        `Sending verification email to user: ${user.email}, name: ${user.name}`
      );
      // Create frontend verification URL instead of API URL
      const verificationLink = `${
        process.env.BETTER_AUTH_URL || "http://localhost:3000"
      }/auth/verify-email?token=${token}`;

      const template = emailTemplates.emailVerification({
        name: user.name,
        email: user.email,
        verificationLink,
      });

      void sendEmail({
        to: user.email,
        subject: template.subject,
        text: `Click the link to verify your email: ${verificationLink}`,
        html: template.html,
      });
    },
  },

  // Enhanced session configuration for better security and performance
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    // Additional security settings
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true, // Prevent XSS attacks
      sameSite: "lax", // CSRF protection
    },
  },

  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  redirectToSignIn: "/auth/login",
  redirectToSignUp: "/auth/signup",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://192.168.100.12:3000", // Your local network IP
    ...(process.env.NEXT_PUBLIC_APP_URL
      ? [process.env.NEXT_PUBLIC_APP_URL]
      : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },

  // Logging callbacks for authentication activities
  onSignUp: async ({ user }: { user: User }, request?: Request) => {
    console.log(
      `User successfully signed up: ${user.email}, name: ${user.name}`
    );
  },
  onSignIn: async ({ user }: { user: User }, request?: Request) => {
    console.log(`User signed in: ${user.email}, name: ${user.name}`);
  },
  onEmailVerification: async ({ user }: { user: User }, request?: Request) => {
    console.log(`User verified email: ${user.email}, name: ${user.name}`);
  },
});
