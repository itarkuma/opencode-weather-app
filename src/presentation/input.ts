// Line reader over Bun.stdin that works with TTY, pipes and redirects
// (node:readline closes the interface on non-TTY stdin in Bun).
const decoder = new TextDecoder();
const reader = Bun.stdin.stream().getReader();
let pending = "";

export async function readLine(prompt: string): Promise<string | null> {
  process.stdout.write(prompt);
  for (;;) {
    const nl = pending.indexOf("\n");
    if (nl >= 0) {
      const line = pending.slice(0, nl);
      pending = pending.slice(nl + 1);
      return line.replace(/\r$/, "").trim();
    }
    const { done, value } = await reader.read();
    if (done) {
      if (pending.length > 0) {
        const line = pending;
        pending = "";
        return line.replace(/\r$/, "").trim();
      }
      return null;
    }
    pending += decoder.decode(value, { stream: true });
  }
}

export async function ask(prompt: string): Promise<string | null> {
  return readLine(prompt);
}
