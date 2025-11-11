// Runs once per process in the Node.js runtime (build/SSG and server)
// Increase Undici connect timeout to better tolerate slow origins during prerender
import { Agent, setGlobalDispatcher } from "undici";

export async function register() {
  const connectTimeoutMs =
    Number(process.env.FETCH_CONNECT_TIMEOUT_MS || 30000) || 30000;

  // headersTimeout/bodyTimeout provide overall request safety nets
  const headersTimeoutMs =
    Number(process.env.FETCH_HEADERS_TIMEOUT_MS || 60000) || 60000;
  const bodyTimeoutMs =
    Number(process.env.FETCH_BODY_TIMEOUT_MS || 120000) || 120000;

  setGlobalDispatcher(
    new Agent({
      connect: { timeout: connectTimeoutMs },
      headersTimeout: headersTimeoutMs,
      bodyTimeout: bodyTimeoutMs,
    })
  );
}
