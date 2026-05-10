export const formatDate = (date: Date | string, opts?: Intl.DateTimeFormatOptions) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', opts ?? { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatYear = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getFullYear().toString();
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const readingTime = (text: string) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));
