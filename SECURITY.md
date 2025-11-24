# Security Architecture & Audit

## Overview
This document outlines the security measures implemented in the SmartSpeak Language Assistant to protect user data and prevent common web vulnerabilities.

## 🛡️ Vulnerability Protections

### 1. SQL Injection (SQLi)
**Status: Protected**
- **Mechanism:** We use the `supabase-js` client library, which acts as an ORM (Object-Relational Mapping).
- **How it works:** All database queries are parameterized automatically. We do not construct raw SQL strings using user input.
- **Why SQLmap is not needed:** SQLmap is used to find vulnerabilities in raw SQL injection points. Since our architecture does not expose raw SQL endpoints and uses strict parameterization, automated SQL injection tools will not find exploitable vectors.

### 2. Cross-Site Scripting (XSS)
**Status: Protected**
- **Mechanism:** React automatically escapes all content rendered in JSX.
- **Audit:** We scanned for `dangerouslySetInnerHTML`. The only usage is in the charting library (`recharts`/`shadcn`), which injects style variables from configuration, not user input.
- **Sanitization:** User inputs (e.g., chat messages) are treated as text, not HTML, preventing script injection.

### 3. Cross-Site Request Forgery (CSRF)
**Status: Protected**
- **Mechanism:** 
    - Supabase Auth uses secure, HttpOnly cookies (or local storage with secure token handling) for session management.
    - Next.js Server Actions and API routes enforce origin checks.
    - `SameSite=Lax` cookie policy is enforced by default.

### 4. Content Security Policy (CSP)
**Status: Implemented**
- **Headers:** We have configured strict HTTP headers in `next.config.js`:
    - `Content-Security-Policy`: Restricts sources for scripts, styles, images, and connections.
        - **Scripts:** Allowed from self, Google (Auth/reCAPTCHA).
        - **Connect:** Allowed to Supabase and Google Gemini.
    - `X-Frame-Options: SAMEORIGIN`: Prevents Clickjacking (embedding site in iframes).
    - `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
    - `Strict-Transport-Security (HSTS)`: Enforces HTTPS.

## 🔒 Data Protection
- **Row Level Security (RLS):** Database policies ensure users can ONLY access their own data.
- **IP Logging:** `security_logs` table tracks login attempts and IP addresses.
- **Account Deletion:** Secure RPC function allows complete data removal.

## 🚀 Recommendations for Production
1. **HTTPS:** Ensure Vercel/Netlify serves the site over HTTPS (automatic).
2. **Environment Variables:** Keep `SUPABASE_SERVICE_ROLE_KEY` secret. Never expose it in `NEXT_PUBLIC_` variables.
3. **Regular Audits:** Periodically review `npm audit` for dependency vulnerabilities.
