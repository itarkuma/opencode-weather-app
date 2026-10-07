// Minimal ANSI colors, zero deps. Disabled when stdout is not a TTY
// (pipes/redirects) or NO_COLOR is set, so output stays script-friendly.
const CODES = {
  cyan: "\u001b[36m",
  yellow: "\u001b[33m",
  green: "\u001b[32m",
  red: "\u001b[31m",
} as const;

const RESET = "\u001b[0m";

function enabled(): boolean {
  return process.stdout.isTTY === true && process.env["NO_COLOR"] === undefined;
}

function paint(code: string, text: string): string {
  return enabled() ? `${code}${text}${RESET}` : text;
}

export function cyan(text: string): string {
  return paint(CODES.cyan, text);
}

export function yellow(text: string): string {
  return paint(CODES.yellow, text);
}

export function green(text: string): string {
  return paint(CODES.green, text);
}

export function red(text: string): string {
  return paint(CODES.red, text);
}
