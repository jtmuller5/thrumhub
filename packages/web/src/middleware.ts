import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function createLimiters(redis: Redis) {
  return {
    // Public reads: 60 requests per 60s window
    read: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "60 s"),
      prefix: "rl:read",
    }),
    // Authenticated writes: 10 requests per 60s window
    write: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "rl:write",
    }),
    // Download increments: 10 per snippet per IP per hour
    download: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "3600 s"),
      prefix: "rl:dl",
    }),
  };
}

let limiters: ReturnType<typeof createLimiters> | null = null;

function getLimiters() {
  if (limiters) return limiters;
  const redis = getRedis();
  if (!redis) return null;
  limiters = createLimiters(redis);
  return limiters;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function setSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://avatars.githubusercontent.com data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'"
  );
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function rateLimitResponse(reset: number): NextResponse {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return new NextResponse(
    JSON.stringify({ error: "Too many requests" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(retryAfter, 1)),
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rl = getLimiters();

  // Rate limit API routes when Redis is configured
  if (rl && pathname.startsWith("/api/snippets")) {
    const ip = getClientIp(request);
    const method = request.method;

    // Download increment: 1 per snippet per IP per hour
    if (
      method === "GET" &&
      request.nextUrl.searchParams.get("source") === "cli" &&
      pathname.match(/^\/api\/snippets\/[^/]+$/)
    ) {
      const snippetId = pathname.split("/").pop()!;
      const { success, reset } = await rl.download.limit(`${ip}:${snippetId}`);
      if (!success) {
        const response = rateLimitResponse(reset);
        setSecurityHeaders(response);
        return response;
      }
    }

    // Writes: POST/PUT
    if (method === "POST" || method === "PUT") {
      const { success, reset } = await rl.write.limit(ip);
      if (!success) {
        const response = rateLimitResponse(reset);
        setSecurityHeaders(response);
        return response;
      }
    }

    // All API reads
    if (method === "GET") {
      const { success, reset } = await rl.read.limit(ip);
      if (!success) {
        const response = rateLimitResponse(reset);
        setSecurityHeaders(response);
        return response;
      }
    }
  }

  const response = NextResponse.next();
  setSecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and _next internals
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
