let configured = false;

export function configureUndiciTimeouts() {
  if (configured) return;
  // Only attempt in Node.js environments (e.g., during build/Node runtime)
  if (typeof process === "undefined" || !process.versions?.node) return;
  try {
    // Use dynamic require to avoid bundling in edge/worker runtimes
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Agent, setGlobalDispatcher } = require("node:undici");
    const timeoutMsEnv = process.env.UNDICI_CONNECT_TIMEOUT_MS;
    const timeoutMs = timeoutMsEnv ? Number(timeoutMsEnv) : 30000;
    setGlobalDispatcher(
      new Agent({
        connect: {
          timeout: Number.isFinite(timeoutMs) ? timeoutMs : 30000,
        },
      })
    );
    configured = true;
  } catch (err) {
    // Ignore if undici is not available in the current runtime
  }
}
