import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendInquiry, validateContact, type Inquiry } from './contact';
const inquiry: Inquiry = { request_id: 'b8865d24-2d5d-41ea-9035-2828ef2e9e44', name: 'Demo Person', email: 'demo@example.com', message: 'Please test this sample inquiry.', website: '' };
const endpoint = 'https://example.supabase.co/functions/v1/contact-submit';
afterEach(() => vi.unstubAllGlobals());
describe('validation', () => {
  it('accepts valid input and boundaries', () => {
    expect(validateContact(inquiry)).toEqual({});
    expect(validateContact({ ...inquiry, name: 'ab', message: 'a'.repeat(10) })).toEqual({});
    expect(validateContact({ ...inquiry, name: 'a'.repeat(80), message: 'a'.repeat(1000) })).toEqual({});
  });
  it.each([['name', ' '], ['name', 'a'.repeat(81)], ['email', 'invalid'], ['email', 'a'.repeat(250) + '@example.com'], ['message', 'short'], ['message', 'a'.repeat(1001)], ['website', 'https://spam.example']])('rejects invalid %s', (field, value) => expect(validateContact({ ...inquiry, [field]: value })).toHaveProperty(field));
});
describe('storage confirmation', () => {
  it('accepts only matching confirmation and sends no credential', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'received', request_id: inquiry.request_id })));
    vi.stubGlobal('fetch', fetcher);
    expect(await sendInquiry(inquiry, endpoint)).toBe(inquiry.request_id);
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual(inquiry);
    expect(fetcher.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'application/json' });
  });
  it.each([{ error: 'failed' }, { status: 'received', request_id: 'wrong' }, { stored: true }, null])('rejects false success %j', async payload => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))));
    await expect(sendInquiry(inquiry, endpoint)).rejects.toThrow();
  });
  it.each([400, 401, 429, 500, 503])('rejects HTTP %s', async status => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status })));
    await expect(sendInquiry(inquiry, endpoint)).rejects.toThrow();
  });
  it('rejects malformed JSON, network failure, and timeout', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('not json')).mockRejectedValueOnce(new TypeError('offline')).mockRejectedValueOnce(new DOMException('Timed out', 'TimeoutError')));
    for (let i = 0; i < 3; i++) await expect(sendInquiry(inquiry, endpoint)).rejects.toThrow();
  });
  it('does not send with missing or insecure configuration', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    for (const url of [undefined, '', 'http://example.com/functions/v1/contact-submit', 'https://example.com/database']) await expect(sendInquiry(inquiry, url)).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
});
