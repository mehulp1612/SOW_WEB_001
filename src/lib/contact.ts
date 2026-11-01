export interface ContactFields { name: string; email: string; message: string; website: string }
export interface Inquiry extends ContactFields { request_id: string }
export type FieldErrors = Partial<Record<keyof ContactFields, string>>;
export function validateContact(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  if (fields.name.trim().length < 2 || fields.name.trim().length > 80) errors.name = 'Enter a name between 2 and 80 characters.';
  if (fields.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Enter a valid email address, up to 254 characters.';
  if (fields.message.trim().length < 10 || fields.message.trim().length > 1000) errors.message = 'Enter a message between 10 and 1,000 characters.';
  if (fields.website !== '') errors.website = 'Unable to submit this form. Please leave the website field empty.';
  return errors;
}
export async function sendInquiry(inquiry: Inquiry, endpoint: string | undefined, signal?: AbortSignal): Promise<string> {
  if (!endpoint || endpoint.includes('YOUR_PROJECT_REF')) throw new Error('The contact form is not connected yet. Please try again once the demo has been configured.');
  let url: URL;
  try { url = new URL(endpoint); } catch { throw new Error('The contact form connection is not configured correctly.'); }
  if (url.protocol !== 'https:' || url.pathname !== '/functions/v1/contact-submit' || url.username || url.password || url.search || url.hash) throw new Error('The contact form requires a secure contact-submit endpoint.');
  try {
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inquiry),
      signal: AbortSignal.any([AbortSignal.timeout(20000), ...(signal ? [signal] : [])]), credentials: 'omit', redirect: 'error',
    });
    if (!response.ok) throw new Error('Storage could not be confirmed. Please retry this inquiry.');
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('status' in result) || result.status !== 'received' || !('request_id' in result) || result.request_id !== inquiry.request_id) throw new Error('Storage could not be confirmed. Please retry this inquiry.');
    return inquiry.request_id;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Storage could not')) throw error;
    throw new Error('We could not confirm your inquiry was received. Check your connection and retry; the same reference will be used to avoid duplicates.');
  }
}
