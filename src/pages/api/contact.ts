export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { render } from '@react-email/render';
import { sendMail } from '~/lib/mailer';
import ContactNotification from '~/emails/ContactNotification';
import ContactAutoReply from '~/emails/ContactAutoReply';

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  organization: z.string().max(200).optional(),
  topic: z.enum(['speaking', 'media', 'advisory', 'other']),
  message: z.string().min(10).max(5000),
  // honeypot — must be empty
  website: z.string().max(0).optional(),
});

// In-memory rate limit (per process). Suitable for low-volume single-instance Node.
const HITS = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;

const rateLimit = (key: string, max: number) => {
  const now = Date.now();
  const entry = HITS.get(key);
  if (!entry || entry.reset < now) {
    HITS.set(key, { count: 1, reset: now + WINDOW_MS });
    return { ok: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { ok: false, remaining: 0 };
  entry.count += 1;
  return { ok: true, remaining: max - entry.count };
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const ua = request.headers.get('user-agent') ?? 'unknown';

  const rateLimitMax = parseInt(import.meta.env.RATE_LIMIT_PER_MIN ?? '5', 10);
  const rl = rateLimit(ip, rateLimitMax);
  if (!rl.ok) {
    return json({ ok: false, error: 'Too many requests. Try again in a minute.' }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      { ok: false, error: 'Validation failed.', issues: parsed.error.flatten() },
      400,
    );
  }

  // Honeypot triggered
  if (parsed.data.website && parsed.data.website.length > 0) {
    return json({ ok: true });
  }

  const { name, email, organization, topic, message } = parsed.data;
  const subject = `[Website] ${topic.toUpperCase()} — ${name}`;

  try {
    const notificationHtml = await render(
      ContactNotification({ name, email, organization, topic, message, ip, userAgent: ua }),
    );
    const notificationText = await render(
      ContactNotification({ name, email, organization, topic, message, ip, userAgent: ua }),
      { plainText: true },
    );
    const autoReplyHtml = await render(ContactAutoReply({ name }));
    const autoReplyText = await render(ContactAutoReply({ name }), { plainText: true });

    const mailTo = import.meta.env.MAIL_TO;
    if (!mailTo) throw new Error('MAIL_TO env var is required.');

    await Promise.all([
      sendMail({
        to: mailTo,
        subject,
        html: notificationHtml,
        text: notificationText,
        replyTo: `${name} <${email}>`,
      }),
      sendMail({
        to: email,
        subject: 'Thanks — Reyad has received your message',
        html: autoReplyHtml,
        text: autoReplyText,
      }),
    ]);

    return json({ ok: true });
  } catch (err) {
    console.error('contact send failed:', err);
    return json({ ok: false, error: 'Could not send the message right now. Please try again.' }, 500);
  }
};
