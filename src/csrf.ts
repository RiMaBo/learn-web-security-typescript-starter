import type { RequestHandler } from "express";
import { timingSafeEqual } from "node:crypto";
import { sendErrorPage } from "./errors.ts";

export function validateRequestOrigin(appOrigin: string): RequestHandler {
  return (req, res, next) => {
    if (req.method !== "POST") {
      next();
      return;
    }

    const origin = req.header("Origin");
    if (origin) {
      if (origin === appOrigin) {
        next();
        return;
      }
      sendErrorPage(res, 403, "Forbidden", "The request did not originate from the app.");
      return;
    }

    const referer = req.header("Referer");
    if (referer) {
      try {
        if (new URL(referer).origin === appOrigin) {
          next();
          return;
        }
      } catch {
        sendErrorPage(res, 403, "Forbidden", "The request did not originate from the app.");
        return;
      }
    }
    sendErrorPage(res, 403, "Forbidden", "The request did not originate from the app.");
    return;
  };
}

export function csrfTokensMatch(expected: string, actual: unknown): boolean {
  if (typeof actual !== "string") {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
