// Paste into the sole TypeScript/Bun inline step of contact_intake.
// Bind db to a protected Windmill resource, never a caller-controlled Flow input.
type ContactSupabase = { url: string; secret_key: string };

export async function main(
  db: ContactSupabase,
  request_id: string,
  name: string,
  email: string,
  message: string,
  website: string,
): Promise<{ stored: true; request_id: string }> {
  if (typeof request_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(request_id) ||
      typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80 ||
      typeof email !== 'string' || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 1000 || website !== '') {
    throw new Error('Invalid intake payload.');
  }
  if (!db || typeof db !== 'object' || typeof db.url !== 'string' || !db.url.trim()) {
    throw new Error('Storage resource URL is missing. Set url in f/web001/supabase and bind the store step db input to that resource.');
  }
  let url: URL;
  try { url = new URL(db.url.trim()); }
  catch { throw new Error('Storage resource url must be the Supabase project HTTPS URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Storage resource url must be the Supabase project HTTPS URL without an API path.');
  if (typeof db.secret_key !== 'string' || !db.secret_key.trim() || db.secret_key.startsWith('$var:')) {
    throw new Error('Storage secret is missing or unresolved. Check the resource secret_key variable reference and runner permissions.');
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json', apikey: db.secret_key };
  // Legacy service_role JWTs also require Authorization. Modern sb_secret_ keys
  // belong only in apikey; they are not JWT bearer tokens.
  if (!db.secret_key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${db.secret_key}`;
  const id = request_id.toLowerCase();
  try {
    const response = await fetch(new URL('/rest/v1/rpc/store_contact_submission', url), {
      method: 'POST', headers, redirect: 'error', signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ p_request_id: id, p_name: name.trim(), p_email: email.trim(), p_message: message.trim() }),
    });
    if (!response.ok) throw new Error('Storage failed.');
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('stored' in result) || result.stored !== true || !('request_id' in result) || result.request_id !== id) throw new Error('Storage failed.');
    return { stored: true, request_id: id };
  } catch {
    throw new Error('Storage could not be confirmed. Retry with the same request ID.');
  }
}
