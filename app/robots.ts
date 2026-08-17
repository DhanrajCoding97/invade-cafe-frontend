import { MetadataRoute } from 'next';
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.invadegamingcafe.com';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
