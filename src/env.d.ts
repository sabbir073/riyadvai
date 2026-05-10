/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_SECURE: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  readonly MAIL_TO: string;
  readonly MAIL_FROM: string;
  readonly RATE_LIMIT_PER_MIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
