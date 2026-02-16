import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import { Resend as ResendClient } from "resend";
import { db } from "@/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/db/schema";

// ── Magic Link Email Template ────────────────────────────
function magicLinkEmail(url: string, host: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to LAB68DEV CV Builder</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Courier New', Courier, monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #ffffff; border: 2px solid #000000;">

          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family: 'Courier New', Courier, monospace; font-size: 14px; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; font-weight: bold;">
                    LAB68DEV
                  </td>
                  <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 2px; color: #666666; text-transform: uppercase;">
                    CV BUILDER
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px 16px 32px;">
              <p style="font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999999; margin: 0 0 8px 0;">
                Authentication Request
              </p>
              <p style="font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: bold; color: #000000; margin: 0 0 24px 0; line-height: 1.3;">
                Sign in to ${host}
              </p>
              <p style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #444444; line-height: 1.6; margin: 0 0 32px 0;">
                Click the button below to securely sign in to your account. This link is valid for 24 hours and can only be used once.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="background-color: #000000;">
                    <a href="${url}" target="_blank" style="display: block; padding: 16px 32px; font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; color: #ffffff; text-decoration: none;">
                      Sign In
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px 32px 32px;">
              <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #999999; line-height: 1.5; margin: 0 0 16px 0;">
                If you did not request this email, you can safely ignore it. No account will be created or modified.
              </p>
              <p style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #cccccc; margin: 0; letter-spacing: 1px;">
                If the button does not work, copy and paste this URL into your browser:
              </p>
              <p style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #999999; margin: 8px 0 0 0; word-break: break-all; line-height: 1.5;">
                ${url}
              </p>
            </td>
          </tr>

          <!-- Bottom Bar -->
          <tr>
            <td style="background-color: #000000; padding: 16px 32px;">
              <p style="font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 2px; color: #666666; text-transform: uppercase; margin: 0; text-align: center;">
                Secured by LAB68DEV &mdash; Brutalist by Design
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ── Adapter ──────────────────────────────────────────────
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  // ── Session Strategy ─────────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ── Providers ────────────────────────────────────────────
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM ?? "onboarding@lab68dev.com",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        const resend = new ResendClient(provider.apiKey);
        await resend.emails.send({
          from: provider.from as string,
          to: email,
          subject: `Sign in to ${host}`,
          html: magicLinkEmail(url, host),
        });
      },
    }),
  ],

  // ── Custom Pages ─────────────────────────────────────────
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },

  // ── Callbacks ────────────────────────────────────────────
  callbacks: {
    /**
     * JWT callback — attach user ID to the token so we can
     * use it in session and Server Actions for RLS checks.
     */
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },

    /**
     * Session callback — expose user.id on the client-side
     * session object for RLS-style authorization checks.
     */
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    /**
     * Authorized callback — used by middleware to check if
     * the user is authenticated before accessing protected routes.
     * Returns Response for unauthorized access (redirect to login).
     */
    authorized({ auth: session, request }) {
      const isAuthenticated = !!session?.user;
      const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

      if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", request.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },

  // ── Trust Host ───────────────────────────────────────────
  trustHost: true,
});
