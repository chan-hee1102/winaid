import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/login`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/signup`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools/review-reply`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/tools/content-generator`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/tools/faq-generator`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
