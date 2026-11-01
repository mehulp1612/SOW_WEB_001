import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';
import { sendInquiry, validateContact, type ContactFields, type FieldErrors, type Inquiry } from '@/lib/contact';
type Submission = { kind: 'idle' } | { kind: 'sending'; inquiry: Inquiry } | { kind: 'failed'; inquiry: Inquiry; error: string } | { kind: 'received'; id: string };
const emptyFields: ContactFields = { name: '', email: '', message: '', website: '' };
export function ContactForm({ endpoint = import.meta.env.VITE_CONTACT_SUBMIT_URL }: { endpoint?: string }) {
  const [fields, setFields] = useState<ContactFields>(emptyFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submission, setSubmission] = useState<Submission>({ kind: 'idle' });
  const active = useRef<AbortController | null>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => () => active.current?.abort(), []);
  const locked = submission.kind === 'sending' || submission.kind === 'failed';
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (active.current) return;
    const validation = validateContact(fields);
    setErrors(validation);
    if (Object.keys(validation).length) {
      form.current?.querySelector<HTMLElement>(`[name="${Object.keys(validation)[0]}"]`)?.focus();
      return;
    }
    const inquiry = submission.kind === 'failed' ? submission.inquiry : { ...fields, name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim(), request_id: crypto.randomUUID() };
    const controller = new AbortController(); active.current = controller;
    setSubmission({ kind: 'sending', inquiry });
    try {
      const id = await sendInquiry(inquiry, endpoint, controller.signal);
      if (!controller.signal.aborted) setSubmission({ kind: 'received', id });
    } catch (error) {
      if (!controller.signal.aborted) setSubmission({ kind: 'failed', inquiry, error: error instanceof Error ? error.message : 'Please try again.' });
    } finally { if (active.current === controller) active.current = null; }
  }
  if (submission.kind === 'received') return <div className="confirmation" role="status"><CheckCircle2 size={38} aria-hidden="true" /><h3>Your inquiry is received.</h3><p>Your demo inquiry has been stored. No service has been booked and no email will be sent.</p><p className="reference">Reference: {submission.id}</p><Button type="button" variant="outline" onClick={() => { setFields(emptyFields); setSubmission({ kind: 'idle' }); }}>Send another inquiry</Button></div>;
  return <form ref={form} onSubmit={submit} noValidate aria-label="Contact form" aria-busy={submission.kind === 'sending'}>
    <div className="form-grid">{(['name', 'email'] as const).map(field => <div className="field" key={field}>
      <label htmlFor={field}>{field === 'name' ? 'Name' : 'Email'} <span aria-hidden="true">*</span></label>
      <input id={field} name={field} type={field === 'email' ? 'email' : 'text'} autoComplete={field} required readOnly={locked} placeholder={field === 'name' ? 'Your name' : 'you@example.com'} value={fields[field]} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} onChange={event => setFields({ ...fields, [field]: event.target.value })} />
      {errors[field] && <p id={`${field}-error`} className="field-error">{errors[field]}</p>}
    </div>)}</div>
    <div className="field"><label htmlFor="message">Message <span aria-hidden="true">*</span></label><textarea id="message" name="message" required rows={5} readOnly={locked} placeholder="Tell us a little about your home project…" value={fields.message} aria-invalid={Boolean(errors.message)} aria-describedby={`message-hint${errors.message ? ' message-error' : ''}`} onChange={event => setFields({ ...fields, message: event.target.value })} /><div id="message-hint" className="field-hint"><span>10–1,000 characters</span><span>{fields.message.length}/1,000</span></div>{errors.message && <p id="message-error" className="field-error">{errors.message}</p>}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={event => setFields({ ...fields, website: event.target.value })} /></div>
    {errors.website && <p role="alert" className="field-error">{errors.website}</p>}
    {submission.kind === 'failed' && <div role="alert" className="submission-error"><p>{submission.error}</p><p className="reference">Reference: {submission.inquiry.request_id}</p><p>Your original details are kept for this retry. Retry here if receipt is uncertain; reloading starts a new form.</p></div>}
    <Button className="w-full" type="submit" disabled={submission.kind === 'sending'}>{submission.kind === 'sending' ? <><LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> Sending inquiry…</> : submission.kind === 'failed' ? 'Retry inquiry' : <>Contact Us <ArrowUpRight size={18} aria-hidden="true" /></>}</Button>
    <p className="form-footnote">Demo inquiries only. Please use harmless test details.</p>
  </form>;
}
