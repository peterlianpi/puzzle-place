# 🔐 Authentication System Documentation

## Overview

Puzzle Place uses a modern, secure authentication system built with **Better Auth** and **Next.js**. The system provides comprehensive user management with email/password authentication, social login, password reset, email verification, and secure session management.

## 🚀 Quick Start

### Environment Setup

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Puzzle Place <noreply@puzzle-place.com>
```

### Installation

```bash
npm install better-auth @tanstack/react-query sonner
```

## 📋 Authentication Flows

### 1. User Registration (Signup)

**File:** `app/auth/signup/page.tsx` & `components/auth/signup-form.tsx`

#### Features:
- ✅ Email/password registration
- ✅ Google OAuth signup
- ✅ Form validation (name, email, password confirmation)
- ✅ Terms & conditions acceptance
- ✅ Automatic email verification sending
- ✅ Password strength requirements
- ✅ Real-time validation feedback

#### Security:
- Password must contain: 8+ chars, uppercase, lowercase, number, special character
- Email verification required before account activation
- CSRF protection enabled
- Rate limiting on registration attempts

#### User Experience:
- Show/hide password toggles
- Loading states during submission
- Success toast notifications
- Automatic redirect to profile page

### 2. User Login

**File:** `app/auth/login/page.tsx` & `components/auth/login-form.tsx`

#### Features:
- ✅ Email/password login
- ✅ Google OAuth login
- ✅ "Remember me" functionality
- ✅ Forgot password link
- ✅ Success message display (from redirects)

#### Security:
- Secure session creation
- Automatic logout on invalid credentials
- Rate limiting on login attempts
- CSRF protection

#### User Experience:
- Show/hide password toggle
- Loading states
- Error message display
- Success message for password resets

### 3. Email Verification

**File:** Integrated into Better Auth configuration

#### Features:
- ✅ Automatic verification email on signup
- ✅ Secure token-based verification
- ✅ Manual resend verification option in profile
- ✅ Professional email templates

#### Security:
- Tokens expire after 24 hours
- One-time use tokens
- Secure token generation

#### User Experience:
- "Resend Verification Email" button in profile
- Success/error toast notifications
- Clear account status display

### 4. Password Reset

**File:** `app/forgot-password/page.tsx`, `components/forgot-password-form.tsx`, `app/auth/reset-password/page.tsx`, `components/auth/reset-password-form.tsx`

#### Features:
- ✅ Email-based password reset requests
- ✅ Secure token-based password updates
- ✅ Password strength validation
- ✅ Password confirmation matching

#### Security:
- Tokens expire after 24 hours
- Secure token validation
- Password strength requirements
- No sensitive data in URLs

#### User Experience:
- Success toast with email confirmation
- Clear instructions in emails
- Loading states during submission
- Automatic redirect after successful reset

### 5. Change Password (Authenticated Users)

**File:** `app/auth/change-password/page.tsx` & `components/auth/change-password-form.tsx`

#### Features:
- ✅ Current password verification
- ✅ New password with strength validation
- ✅ Password confirmation
- ✅ Optional session revocation
- ✅ Security notifications via email

#### Security:
- Current password required for changes
- Password strength validation
- Optional logout of other devices
- Audit trail with email notifications

#### User Experience:
- Show/hide password toggles for all fields
- Real-time validation feedback
- Success/error toast notifications
- Automatic form reset after success

### 6. User Profile Management

**File:** `app/auth/profile/page.tsx`

#### Features:
- ✅ Account status display (verified/unverified)
- ✅ Member since date
- ✅ Resend verification email
- ✅ Account information display

#### Security:
- Session-based access control
- Automatic redirect if not authenticated

#### User Experience:
- Clean, card-based layout
- Clear account status indicators
- Easy navigation to other features

## 🔒 Security Features

### Authentication Security
- **Better Auth Framework**: Industry-standard authentication
- **Secure Sessions**: HTTP-only cookies with proper expiration
- **CSRF Protection**: Automatic cross-site request forgery prevention
- **Rate Limiting**: Built-in protection against brute force attacks
- **Password Policies**: Strong password requirements enforced

### Email Security
- **Token-Based Verification**: No sensitive data in emails
- **Secure Token Generation**: Cryptographically secure random tokens
- **Token Expiration**: Automatic cleanup of expired tokens
- **TLS Encryption**: Secure email transmission

### Session Security
- **Secure Cookies**: HTTPS-only in production
- **Session Timeout**: Automatic logout after inactivity
- **Concurrent Session Management**: Option to revoke other sessions
- **Session Fixation Protection**: New session IDs on login

## 📧 Email Templates

### Professional Templates Include:
- **Password Reset**: Clear instructions with security notices
- **Email Verification**: Welcome message with verification button
- **Password Changed**: Security notification for account changes
- **Welcome**: Post-verification onboarding message

### Template Features:
- ✅ Mobile-responsive design
- ✅ Professional branding
- ✅ Security warnings and notices
- ✅ Clear call-to-action buttons
- ✅ HTML + plain text fallbacks

## 🔧 API Reference

### Better Auth Client Methods

```typescript
import { authClient } from "@/lib/auth/auth-client";

// Authentication
await authClient.signUp.email({ email, password, name });
await authClient.signIn.email({ email, password });
await authClient.signOut();

// Password Management
await authClient.requestPasswordReset({ email });
await authClient.resetPassword({ newPassword, token });

// Email Verification
await authClient.sendVerificationEmail();
await authClient.getSession();
```

### Custom Hooks

```typescript
// Authentication Hooks
const signupMutation = useSignup();
const loginMutation = useLogin();
const logoutMutation = useLogout();

// Password Management
const forgotPasswordMutation = useForgotPassword();
const resetPasswordMutation = useResetPassword();
const changePasswordMutation = useChangePassword();

// Email Verification
const resendVerificationMutation = useResendVerification();
```

## 🚦 Error Handling

### Client-Side Errors
- Form validation with real-time feedback
- Network error handling
- Toast notifications for success/error states
- Automatic retry mechanisms

### Server-Side Errors
- Comprehensive error logging
- Secure error messages (no sensitive data leakage)
- Proper HTTP status codes
- Database connection error handling

## 📊 Performance Optimizations

### Frontend Performance
- **React Query**: Intelligent caching and background updates
- **Lazy Loading**: Components loaded on demand
- **Optimistic Updates**: Immediate UI feedback
- **Debounced Validation**: Efficient form validation

### Backend Performance
- **Database Indexing**: Optimized queries
- **Session Caching**: Reduced database calls
- **Email Queuing**: Asynchronous email sending
- **Connection Pooling**: Efficient database connections

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with email verification
- [ ] User login/logout functionality
- [ ] Password reset flow (request → email → reset)
- [ ] Change password for authenticated users
- [ ] Email verification resend functionality
- [ ] Session persistence across browser refreshes
- [ ] Social login (Google OAuth)
- [ ] Form validation and error handling
- [ ] Mobile responsiveness

### Automated Testing
```bash
# Run authentication tests
npm run test:auth

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DATABASE_URL=your-production-db-url
```

### Security Checklist
- [ ] HTTPS enabled
- [ ] Secure cookies configured
- [ ] Database SSL enabled
- [ ] SMTP TLS enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Monitoring and logging enabled

## 🐛 Troubleshooting

### Common Issues

**1. Email Not Sending**
- Check SMTP credentials
- Verify Gmail App Password
- Check spam folder
- Review server logs

**2. Token Invalid Errors**
- Restart server after configuration changes
- Check token expiration (24 hours)
- Verify baseURL configuration

**3. Database Connection Errors**
- Check DATABASE_URL
- Verify SSL settings
- Check database server status

**4. Session Issues**
- Clear browser cookies
- Check session configuration
- Verify cookie settings

### Debug Mode

Enable debug logging:
```typescript
// In auth.ts
console.log('Password reset URL:', resetLink);
console.log('Token:', token);

// In email.ts
debug: true,
logger: true,
```

## 📚 Additional Resources

- [Better Auth Documentation](https://better-auth.com)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [React Query Documentation](https://tanstack.com/query)
- [Sonner Toast Library](https://sonner.emilkowal.ski)

## 🤝 Contributing

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier code formatting
- Comprehensive error handling

### Security Guidelines
- Never log sensitive information
- Use environment variables for secrets
- Implement proper input validation
- Regular security audits

---

**Last Updated:** January 7, 2026
**Version:** 1.0.0
**Framework:** Next.js 16 + Better Auth