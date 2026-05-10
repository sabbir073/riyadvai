import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, PERSON } from '~/data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('insights', ({ data }) => !data.draft);
  return rss({
    title: `${SITE.name} — Insights`,
    description: `Long-form essays by ${PERSON.fullName} on ICT policy, telecom, and the digital economy.`,
    site: context.site ?? SITE.url,
    items: posts
      .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishedAt,
        link: `/insights/${post.id}/`,
        categories: post.data.tags,
        author: PERSON.email + ' (' + PERSON.fullName + ')',
      })),
    customData: `<language>en-us</language><copyright>© ${new Date().getFullYear()} ${PERSON.fullName}</copyright>`,
  });
}
