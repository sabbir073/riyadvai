import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const opEds = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/op-eds' }),
  schema: z.object({
    title: z.string(),
    outlet: z.string(),
    publishedAt: z.coerce.date(),
    teaser: z.string(),
    pullQuote: z.string().optional(),
    externalUrl: z.string().url(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const tv = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tv' }),
  schema: z.object({
    title: z.string(),
    network: z.string(),
    program: z.string(),
    host: z.string().optional(),
    airedAt: z.coerce.date(),
    duration: z.string().optional(),
    teaser: z.string(),
    externalUrl: z.string().url(),
    thumbnail: z.string().optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    location: z.string(),
    startYear: z.number(),
    endYear: z.number().nullable(),
    summary: z.string(),
    achievements: z.array(z.string()).default([]),
    order: z.number(),
    logo: z.string().optional(),
  }),
});

const policies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/policies' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    accent: z.enum(['cyan', 'gold', 'magenta', 'emerald', 'indigo']),
    icon: z.string(),
    summary: z.string(),
    points: z.array(z.string()).default([]),
    order: z.number(),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

const speaking = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/speaking' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    location: z.string(),
    date: z.coerce.date(),
    type: z.enum(['keynote', 'panel', 'workshop', 'fireside', 'tv', 'roundtable']),
    summary: z.string(),
    upcoming: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// Press coverage / news about Smart Lab and Reyad — articles by journalists,
// NOT pieces Reyad authored. Lives separately from `opEds`.
const news = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    outlet: z.string(),
    publishedAt: z.coerce.date(),
    teaser: z.string(),
    externalUrl: z.string().url(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { opEds, tv, experience, policies, insights, speaking, news };
