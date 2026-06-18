import seoDataLocal from '../app/data/seo_content.json';

export interface PageSeo {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_title: string;
  og_description: string;
  slug: string;
  h1: string;
  content: string;
  faqs: Array<{ question: string; answer: string }>;
  faq_schema?: any;
}

/**
 * Retrieves SEO data for a page.
 * Tries fetching from the live backend API first (for real-time updates without redeployments).
 * Falls back to local static JSON if the backend is down or during build/pre-rendering.
 */
export async function getSeoData(pageKey: string): Promise<PageSeo | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const res = await fetch(`${API_URL}/api/seo/${pageKey}`, {
      next: { revalidate: 3600 } // Cache for 1 hour, standard ISR
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Ignore fetch errors (e.g. during build-time on Vercel) and fall back to local file
  }

  const localData = seoDataLocal as Record<string, PageSeo>;
  return localData[pageKey] || null;
}
