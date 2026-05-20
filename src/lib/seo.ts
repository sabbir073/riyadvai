import { PERSON, SITE } from '~/data/site';

type ImageObject = { url: string; width?: number; height?: number; alt?: string };

const absolute = (path: string) => (path.startsWith('http') ? path : `${SITE.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`);

export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: PERSON.fullName,
  givenName: PERSON.givenName,
  familyName: PERSON.familyName,
  jobTitle: PERSON.jobTitle,
  description: PERSON.shortBio,
  url: SITE.url,
  email: `mailto:${PERSON.email}`,
  telephone: PERSON.phone,
  image: absolute('/images/riyadvai.jpg'),
  address: {
    '@type': 'PostalAddress',
    addressLocality: PERSON.city,
    addressCountry: PERSON.country,
  },
  worksFor: {
    '@type': 'Organization',
    name: PERSON.worksFor,
  },
  alumniOf: PERSON.alumniOf.map((a) => ({
    '@type': 'EducationalOrganization',
    name: a.name,
  })),
  knowsAbout: [
    'ICT Policy',
    'Telecommunications',
    'Mobile Financial Services',
    'Digital Economy',
    'Regulatory Reform',
    'Bangladesh',
    '3G/4G/5G',
    'Fintech',
  ],
  sameAs: Object.values(PERSON.socials).filter((s) => s.startsWith('http')),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  publisher: { '@id': `${SITE.url}/#person` },
  inLanguage: SITE.language,
});

export const articleSchema = (input: {
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  url: string;
  image?: string;
  publisher?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: input.title,
  description: input.description,
  datePublished: input.publishedAt.toISOString(),
  dateModified: (input.updatedAt ?? input.publishedAt).toISOString(),
  url: absolute(input.url),
  image: input.image ? absolute(input.image) : undefined,
  author: { '@id': `${SITE.url}/#person` },
  publisher: input.publisher
    ? { '@type': 'Organization', name: input.publisher }
    : { '@id': `${SITE.url}/#person` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(input.url) },
});

export const videoObjectSchema = (input: {
  name: string;
  description: string;
  uploadDate: Date;
  duration?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: input.name,
  description: input.description,
  uploadDate: input.uploadDate.toISOString(),
  duration: input.duration,
  embedUrl: input.embedUrl,
  thumbnailUrl: input.thumbnailUrl ? absolute(input.thumbnailUrl) : undefined,
  url: absolute(input.url),
  publisher: { '@id': `${SITE.url}/#person` },
});

export const breadcrumbSchema = (crumbs: Array<{ label: string; href: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    item: absolute(c.href),
  })),
});

export const faqSchema = (qa: Array<{ q: string; a: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qa.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

export const eventSchema = (input: {
  name: string;
  startDate: Date;
  location: string;
  description: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: input.name,
  startDate: input.startDate.toISOString(),
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: input.location,
    address: { '@type': 'PostalAddress', addressLocality: input.location },
  },
  description: input.description,
  performer: { '@id': `${SITE.url}/#person` },
  organizer: { '@id': `${SITE.url}/#person` },
  url: absolute(input.url),
});

export const buildOgUrl = (path: string, title?: string) => {
  const u = new URL('/og.png', SITE.url);
  u.searchParams.set('path', path);
  if (title) u.searchParams.set('title', title);
  return u.toString();
};

export type SeoInput = {
  title: string;
  description?: string;
  path: string;
  image?: ImageObject;
  type?: 'website' | 'article';
  publishedAt?: Date;
  updatedAt?: Date;
  noindex?: boolean;
};
