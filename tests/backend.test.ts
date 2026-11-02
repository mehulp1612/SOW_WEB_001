// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHandler, MAX_BODY_BYTES, type IntakeConfig } from '../supabase/functions/contact-submit/handler';
import { main as store } from '../windmill/contact_intake';

const config: IntakeConfig = { allowedOrigin: 'https://mehulp1612.github.io', windmillUrl: 'https://app.windmill.dev/api/w/demo/jobs/run_wait_result/f/f/web001/contact_intake', windmillToken: 'test-only-token' };
const payload = { request_id: 'b8865d24-2d5d-41ea-9035-2828ef2e9e44', name: 'Demo Person', email: 'demo@example.com', message: 'A harmless demo inquiry.', website: '' };
const request = (body: unknown = payload, headers: HeadersInit = {}) => new Request('https://example.supabase.co/functions/v1/contact-submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: config.allowedOrigin, ...headers }, body: JSON.stringify(body) });
const confirmed = () => new Response(JSON.stringify({ stored: true, request_id: payload.request_id }));
afterEach(() => vi.unstubAllGlobals());

describe('public Edge handler', () => {
  it('accepts public submissions, authenticates Windmill, and confirms storage', async () => {
    const upstream = vi.fn<typeof fetch>().mockResolvedValue(confirmed());
    const result = await createHandler(config, upstream)(request());
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({ status: 'received', request_id: payload.request_id });
    expect(result.headers.get('Access-Control-Allow-Origin')).toBe(config.allowedOrigin);
    expect(upstream.mock.calls[0][1]?.headers).toEqual({ 'Content-Type': 'application/json', Authorization: 'Bearer test-only-token' });
  });
  it.each([null, [], {}, { ...payload, name: 'a' }, { ...payload, name: 'a'.repeat(81) }, { ...payload, email: 'bad' }, { ...payload, email: 'a'.repeat(255) }, { ...payload, message: 'short' }, { ...payload, message: 'a'.repeat(1001) }, { ...payload, website: 'bot' }, { ...payload, request_id: 'bad' }, { ...payload, db: 'override' }])('rejects bad input before invoking Windmill: %j', async body => {
    const upstream = vi.fn<typeof fetch>();
    expect((await createHandler(config, upstream)(request(body))).status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('limits actual bytes even when Content-Length is absent or misleading', async () => {
    const upstream = vi.fn<typeof fetch>();
    const handler = createHandler(config, upstream);
    expect((await handler(request({ ...payload, message: 'x'.repeat(MAX_BODY_BYTES) }))).status).toBe(413);
    expect((await handler(request({ ...payload, message: 'x'.repeat(MAX_BODY_BYTES) }, { 'Content-Length': '2' }))).status).toBe(413);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('handles preflight, rejects other origins and methods, and restricts path', async () => {
    const handler = createHandler(config, vi.fn());
    expect((await handler(new Request('https://example.supabase.co/contact-submit', { method: 'OPTIONS', headers: { Origin: config.allowedOrigin } }))).status).toBe(204);
    const rejected = await handler(request(payload, { Origin: 'https://evil.example' }));
    expect(rejected.status).toBe(403); expect(rejected.headers.has('Access-Control-Allow-Origin')).toBe(false);
    expect((await handler(new Request('https://example.supabase.co/contact-submit'))).status).toBe(405);
    expect((await handler(new Request('https://example.supabase.co/other'))).status).toBe(404);
    expect((await handler(request(payload, { 'Content-Type': 'text/plain' }))).status).toBe(415);
  });
  it('does not treat CORS as authentication: no-Origin clients still undergo validation', async () => {
    const req = request(); req.headers.delete('Origin');
    const result = await createHandler(config, vi.fn<typeof fetch>().mockResolvedValue(confirmed()))(req);
    expect(result.status).toBe(200); expect(result.headers.has('Access-Control-Allow-Origin')).toBe(false);
  });
  it.each([{ error: 'secret upstream failure' }, { stored: true, request_id: 'wrong' }, { stored: 'true', request_id: payload.request_id }, null])('rejects HTTP 200 false success: %j', async body => {
    const result = await createHandler(config, vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body))))(request());
    expect(result.status).toBe(502); expect(await result.text()).not.toContain('secret upstream failure');
  });
  it('fails honestly on unavailable upstream, invalid JSON, timeout, and missing config', async () => {
    for (const upstream of [vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 503 })), vi.fn<typeof fetch>().mockResolvedValue(new Response('bad json')), vi.fn<typeof fetch>().mockRejectedValue(new DOMException('secret', 'TimeoutError'))]) {
      const result = await createHandler(config, upstream)(request()); expect(result.status).toBe(503); expect(await result.text()).not.toContain('secret');
    }
    expect((await createHandler({ ...config, windmillToken: '' }, vi.fn())(request())).status).toBe(503);
  });
});

describe('Windmill storage step', () => {
  const db = { url: 'https://example.supabase.co', secret_key: 'sb_secret_test_only' };
  const run = () => store(db, payload.request_id, payload.name, payload.email, payload.message, payload.website);
  it.each(['', '   '])('reports an empty resource URL without calling the database', async url => {
    const transport = vi.fn(); vi.stubGlobal('fetch', transport);
    await expect(store({ ...db, url }, payload.request_id, payload.name, payload.email, payload.message, '')).rejects.toThrow('Storage resource URL is missing');
    expect(transport).not.toHaveBeenCalled();
  });
  it('does not expose invalid URL contents in errors', async () => {
    await expect(store({ ...db, url: 'private-invalid-value' }, payload.request_id, payload.name, payload.email, payload.message, '')).rejects.toThrow(/^Storage resource url must be the Supabase project HTTPS URL\.$/);
  });
  it.each(['', '$var:f/web001/supabase_secret_key'])('rejects a missing or unresolved secret', async secret_key => {
    const transport = vi.fn(); vi.stubGlobal('fetch', transport);
    await expect(store({ ...db, secret_key }, payload.request_id, payload.name, payload.email, payload.message, '')).rejects.toThrow('Storage secret is missing or unresolved');
    expect(transport).not.toHaveBeenCalled();
  });
  it('calls the restricted RPC and verifies its explicit result', async () => {
    const transport = vi.fn<typeof fetch>().mockImplementation(async () => confirmed()); vi.stubGlobal('fetch', transport);
    expect(await run()).toEqual({ stored: true, request_id: payload.request_id });
    expect(await run()).toEqual({ stored: true, request_id: payload.request_id });
    expect(transport.mock.calls[0][0]?.toString()).toBe('https://example.supabase.co/rest/v1/rpc/store_contact_submission');
    expect(transport.mock.calls[0][1]?.headers).toEqual({ apikey: db.secret_key, 'Content-Type': 'application/json' });
    expect(transport.mock.calls[0][1]?.body).toBe(transport.mock.calls[1][1]?.body);
  });
  it('does not expose a credential on storage failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('sb_secret_test_only')));
    await expect(run()).rejects.toThrow('Storage could not be confirmed.');
  });
  it.each([{ error: 'database failure' }, { stored: true, request_id: 'wrong' }])('rejects false database success %j', async result => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(result))));
    await expect(run()).rejects.toThrow('Storage could not be confirmed.');
  });
});
