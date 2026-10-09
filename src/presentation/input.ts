// Line reader over Bun.stdin that works with TTY, pipes and redirects
// (node:readline closes the interface on non-TTY stdin in Bun).
// Reader is created lazily so `bun test` can import this module
// without holding an open stdin handle.
const decoder = new TextDecoder();
interface ByteReader {
  read(): Promise<{ done: boolean; value: Uint8Array | undefined }>;
}
let reader: ByteReader | null = null;
let pending = "";

function getReader(): ByteReader {
  if (!reader) reader = Bun.stdin.stream().getReader() as unknown as ByteReader;
  return reader;
}

export async function readLine(prompt: string): Promise<string | null> {
  process.stdout.write(prompt);
  for (;;) {
    const nl = pending.indexOf("\n");
    if (nl >= 0) {
      const line = pending.slice(0, nl);
      pending = pending.slice(nl + 1);
      return line.replace(/\r$/, "").trim();
    }
    const { done, value } = await getReader().read();
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
