export interface IntakePayload {
  request_id: string;
  name: string;
  email: string;
  message: string;
  website: '';
}

export interface IntakeConfig {
  allowedOrigin: string;
  windmillUrl: string;
  windmillToken: string;
}

class InputError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const MAX_BODY_BYTES = 16 * 1024;

export function validatePayload(value: unknown): IntakePayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError(400, 'Expected a JSON object.');
  const fields = value as Record<string, unknown>;
  const keys = ['request_id', 'name', 'email', 'message', 'website'];
  if (Object.keys(fields).some(key => !keys.includes(key)) || keys.some(key => typeof fields[key] !== 'string')) throw new InputError(400, 'Provide request_id, name, email, message, and website as strings.');
  const { request_id, name, email, message, website } = fields as Record<string, string>;
  if (!UUID.test(request_id)) throw new InputError(400, 'Provide a valid request ID.');
  if (website !== '') throw new InputError(400, 'Unable to accept this inquiry.');
  if (name.trim().length < 2 || name.trim().length > 80) throw new InputError(400, 'Name must contain 2–80 characters.');
  if (email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new InputError(400, 'Provide a valid email of at most 254 characters.');
  if (message.trim().length < 10 || message.trim().length > 1000) throw new InputError(400, 'Message must contain 10–1,000 characters.');
  return { request_id: request_id.toLowerCase(), name: name.trim(), email: email.trim(), message: message.trim(), website: '' };
}

async function readJson(request: Request): Promise<unknown> {
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new InputError(413, 'Request body is too large.');
  if (!request.body) throw new InputError(400, 'A JSON request body is required.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new InputError(413, 'Request body is too large.');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new InputError(400, 'Provide valid JSON.'); }
}

function configIsValid(config: IntakeConfig): boolean {
  try {
    const origin = new URL(config.allowedOrigin);
    const webhook = new URL(config.windmillUrl);
    return origin.origin === config.allowedOrigin && origin.protocol === 'https:' &&
      webhook.protocol === 'https:' && !webhook.username && !webhook.password && !webhook.search && !webhook.hash &&
      /^\/api\/w\/[^/]+\/jobs\/run_wait_result\/(f\/.+|fv\/\d+)$/.test(webhook.pathname) && Boolean(config.windmillToken.trim());
  } catch { return false; }
}

export function createHandler(config: IntakeConfig, transport: typeof fetch = fetch) {
  return async (request: Request): Promise<Response> => {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin' });
    const origin = request.headers.get('origin');
    if (origin === config.allowedOrigin) headers.set('Access-Control-Allow-Origin', origin);
    const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
    const path = new URL(request.url).pathname;
    // Supabase gateways may strip /functions/v1 before invoking the runtime.
    if (path !== '/functions/v1/contact-submit' && path !== '/contact-submit') return reply(404, { error: 'Not found.' });
    if (origin && origin !== config.allowedOrigin) return reply(403, { error: 'Origin is not allowed.' });
    if (request.method === 'OPTIONS') {
      headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      headers.set('Access-Control-Max-Age', '600');
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== 'POST') { headers.set('Allow', 'POST, OPTIONS'); return reply(405, { error: 'Use POST.' }); }
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, { error: 'Use application/json.' });
    let payload: IntakePayload;
    try { payload = validatePayload(await readJson(request)); }
    catch (error) {
      if (error instanceof InputError) return reply(error.status, { error: error.message });
      return reply(400, { error: 'Unable to read this request.' });
    }
    if (!configIsValid(config)) return reply(503, { request_id: payload.request_id, error: 'Intake is not configured. Please try again later.' });
    try {
      const result = await transport(config.windmillUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.windmillToken}` },
        body: JSON.stringify(payload),
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
      });
      if (!result.ok) return reply(503, { request_id: payload.request_id, error: 'Storage could not be confirmed. Retry with the same request ID.' });
      const body: unknown = await result.json();
      if (!body || typeof body !== 'object' || !('stored' in body) || body.stored !== true || !('request_id' in body) || body.request_id !== payload.request_id) return reply(502, { request_id: payload.request_id, error: 'Storage could not be confirmed. Retry with the same request ID.' });
      return reply(200, { request_id: payload.request_id, status: 'received' });
    } catch {
      // Do not forward upstream error text: it may include credentials or form fields.
      return reply(503, { request_id: payload.request_id, error: 'Storage could not be confirmed. Retry with the same request ID.' });
    }
  };
}
