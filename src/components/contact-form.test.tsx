import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { ContactForm } from './contact-form';
const endpoint = 'https://example.supabase.co/functions/v1/contact-submit';
afterEach(() => vi.unstubAllGlobals());
it('rejects blank fields without a request', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  render(<ContactForm endpoint={endpoint} />);
  await userEvent.click(screen.getByRole('button', { name: 'Request a Callback' }));
  expect(screen.getByText('Enter a name between 2 and 80 characters.')).toBeInTheDocument();
  expect(screen.getByLabelText(/Name/)).toHaveFocus();
  expect(fetcher).not.toHaveBeenCalled();
});
it('retries the original payload and ID, then assigns a fresh ID to a new inquiry', async () => {
  const fetcher = vi.fn().mockRejectedValueOnce(new TypeError('offline')).mockImplementation(async (_url, init) => new Response(JSON.stringify({ status: 'received', request_id: JSON.parse(init.body).request_id })));
  vi.stubGlobal('fetch', fetcher);
  render(<ContactForm endpoint={endpoint} />);
  const user = userEvent.setup();
  async function fill() {
    await user.type(screen.getByLabelText(/Name/), 'Demo Person');
    await user.type(screen.getByLabelText(/Email/), 'demo@example.com');
    await user.type(screen.getByLabelText(/Message/), 'Please test my sample inquiry.');
  }
  await fill(); await user.click(screen.getByRole('button', { name: 'Request a Callback' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not confirm');
  expect(screen.getByLabelText(/Name/)).toHaveAttribute('readonly');
  await user.click(screen.getByRole('button', { name: 'Retry inquiry' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Your inquiry is received');
  expect(fetcher.mock.calls[0][1].body).toBe(fetcher.mock.calls[1][1].body);
  await user.click(screen.getByRole('button', { name: 'Send another inquiry' }));
  await fill(); await user.click(screen.getByRole('button', { name: 'Request a Callback' })); await screen.findByRole('status');
  expect(JSON.parse(fetcher.mock.calls[2][1].body).request_id).not.toBe(JSON.parse(fetcher.mock.calls[0][1].body).request_id);
});
it('blocks concurrent submissions and aborts pending work when unmounted', async () => {
  let pendingSignal: AbortSignal | undefined;
  const fetcher = vi.fn((_url: URL, init: RequestInit) => {
    pendingSignal = init.signal as AbortSignal;
    return new Promise<Response>((_resolve, reject) => pendingSignal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  });
  vi.stubGlobal('fetch', fetcher);
  const { unmount } = render(<ContactForm endpoint={endpoint} />);
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Demo Person' } });
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'demo@example.com' } });
  fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Please test my sample inquiry.' } });
  fireEvent.submit(screen.getByRole('form'));
  fireEvent.submit(screen.getByRole('form'));
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: /Sending inquiry/ })).toBeDisabled();
  await act(async () => unmount());
  expect(pendingSignal?.aborted).toBe(true);
});
