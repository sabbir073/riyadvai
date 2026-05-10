import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

export const getTransporter = (): Transporter => {
  if (transporter) return transporter;

  const host = import.meta.env.SMTP_HOST;
  const port = parseInt(import.meta.env.SMTP_PORT ?? '465', 10);
  const secure = (import.meta.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true';
  const user = import.meta.env.SMTP_USER;
  const pass = import.meta.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP credentials missing. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS in .env',
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });

  return transporter;
};

type SendInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  from?: string;
};

export const sendMail = async (input: SendInput) => {
  const t = getTransporter();
  const from = input.from ?? import.meta.env.MAIL_FROM ?? import.meta.env.SMTP_USER;
  return t.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });
};
