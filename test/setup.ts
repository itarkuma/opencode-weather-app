import { rm } from "node:fs/promises";

export function tmpDataFilePath(tag: string): string {
  return `/tmp/weather-test-${tag}-${crypto.randomUUID()}.json`;
}

export async function cleanupTmpFile(path: string): Promise<void> {
  await rm(path, { force: true });
}

export function captureLogs(): { lines: string[]; restore: () => void } {
  const lines: string[] = [];
  const orig = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  return {
    lines,
    restore: () => {
      console.log = orig;
    },
  };
}

export function mockFetchOnce(handler: () => Response | Promise<Response>): () => void {
  const orig = global.fetch;
  global.fetch = (async () => handler()) as unknown as typeof fetch;
  return () => {
    global.fetch = orig;
  };
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
