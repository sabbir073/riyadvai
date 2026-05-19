import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import { cn } from '~/lib/cn';

type Status = 'idle' | 'sending' | 'success' | 'error';

const TOPICS = [
  { value: 'speaking', label: 'Speaking / panel / keynote' },
  { value: 'media', label: 'Media / interview / comment' },
  { value: 'advisory', label: 'Advisory / consulting' },
  { value: 'other', label: 'Something else' },
] as const;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      organization: String(fd.get('organization') ?? ''),
      topic: String(fd.get('topic') ?? 'other'),
      message: String(fd.get('message') ?? ''),
      website: String(fd.get('website') ?? ''),
    };

    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await r.json()) as { ok: boolean; error?: string };
      if (!r.ok || !data.ok) {
        setStatus('error');
        setError(data.error ?? `Something went wrong (HTTP ${r.status}).`);
        return;
      }
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('error');
      setError('Network error. Please try again or email reyad@smart-lab.biz directly.');
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status !== 'success' ? (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Honeypot */}
            <div className="sr-only-focusable" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <Field label="Name" name="name" type="text" required minLength={2} maxLength={120} autoComplete="name" />

            <Field label="Email" name="email" type="email" required maxLength={200} autoComplete="email" />

            <Field label="Organization (optional)" name="organization" type="text" maxLength={200} autoComplete="organization" />

            <SelectField label="What is this about?" name="topic" options={TOPICS} />

            <TextareaField label="Message" name="message" required minLength={10} maxLength={5000} />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-[var(--text-muted)]">
                Reyad responds personally within 48 hours.
              </p>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={cn(
                  'group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--brand)] px-7 font-medium text-[var(--bg-base)] transition-shadow',
                  'hover:shadow-[0_15px_40px_-10px_var(--brand)] disabled:opacity-70',
                )}
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -4, 4, -3, 3, 0] }}
                transition={{ duration: 0.45 }}
                className="flex items-center gap-3 rounded-2xl border border-[oklch(0.65_0.22_25/0.4)] bg-[oklch(0.65_0.22_25/0.12)] p-4 text-sm text-[oklch(0.85_0.18_25)]"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass border-gradient flex min-h-[24rem] flex-col items-center justify-center gap-5 rounded-3xl p-12 text-center"
          >
            <CheckCircle2 className="h-14 w-14 text-[var(--accent-emerald)]" />
            <h3 className="font-serif text-3xl italic text-[var(--text-primary)] md:text-4xl">
              Message received.
            </h3>
            <p className="max-w-md text-[var(--text-muted)]">
              Reyad reads every enquiry personally — expect a reply within 48 hours.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-sm text-[var(--brand)] underline-offset-4 hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="group relative">
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className={cn(
          'peer h-14 w-full rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-glass)] px-4 pt-4 text-base text-[var(--text-primary)] backdrop-blur transition-colors',
          'focus:border-[var(--brand)] focus:bg-[var(--bg-elevated)]',
        )}
        {...rest}
      />
      <label
        htmlFor={name}
        className={cn(
          'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] transition-all',
          'peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--brand)]',
          'peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs',
        )}
      >
        {label}
        {required && <span className="ml-1 text-[var(--brand)]">*</span>}
      </label>
    </div>
  );
}

function TextareaField({
  label,
  name,
  required,
  minLength,
  maxLength,
}: {
  label: string;
  name: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  const [count, setCount] = useState(0);
  return (
    <div className="group relative">
      <textarea
        id={name}
        name={name}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        rows={5}
        placeholder=" "
        onChange={(e) => setCount(e.target.value.length)}
        className={cn(
          'peer min-h-[10rem] w-full resize-y rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-glass)] px-4 pb-4 pt-7 text-base text-[var(--text-primary)] backdrop-blur transition-colors',
          'focus:border-[var(--brand)] focus:bg-[var(--bg-elevated)]',
        )}
      />
      <label
        htmlFor={name}
        className={cn(
          'pointer-events-none absolute left-4 top-4 text-sm text-[var(--text-muted)] transition-all',
          'peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-[var(--brand)]',
          'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs',
        )}
      >
        {label}
        {required && <span className="ml-1 text-[var(--brand)]">*</span>}
      </label>
      {maxLength && (
        <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] text-[var(--text-faint)]">
          {count} / {maxLength}
        </span>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <div className="relative">
      <label htmlFor={name} className="mb-2 block text-xs font-medium uppercase tracking-widest text-[var(--brand)]">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt, i) => (
          <label
            key={opt.value}
            className="cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={i === 0}
              className="peer sr-only"
            />
            <span
              className="flex h-full items-center justify-center rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-glass)] px-3 py-3 text-center text-sm text-[var(--text-muted)] backdrop-blur transition-all hover:border-[var(--border-bright)] hover:text-[var(--text-primary)] peer-checked:border-[var(--brand)] peer-checked:bg-[var(--brand-soft)] peer-checked:text-[var(--text-primary)] peer-checked:shadow-[0_0_30px_-10px_var(--brand)]"
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
