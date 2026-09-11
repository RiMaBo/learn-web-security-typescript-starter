import type { CookieOptions, Response } from "express";

const SESSION_COOKIE_NAME = "session_id";

const sessionCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "lax",
} satisfies CookieOptions;

type CookieSession = {
  token: string;
  expires_at: string;
};

export function setSessionCookie(
  response: Response,
  session: CookieSession,
): void {
  sessionCookieOptions.expires = new Date(session.expires_at);
  response.cookie(SESSION_COOKIE_NAME, session.token, sessionCookieOptions);

  // Boot.dev solution
  // response.cookie(SESSION_COOKIE_NAME, session.token, { ...sessionCookieOptions, expires: new Date(session.expires_at) });
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);
}
