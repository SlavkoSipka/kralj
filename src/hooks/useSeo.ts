import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

const BASE_URL = 'https://kraljresidence.rs';
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/duvwf75cx/image/upload/f_auto,q_auto,w_1920/v1739186475/A12_m1iz64.png';

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/** Sets per-page title, description, canonical and social meta (SPA-friendly). */
export const useSeo = ({ title, description, path, image = DEFAULT_IMAGE }: SeoOptions) => {
  useEffect(() => {
    const url = `${BASE_URL}${path}`;
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertCanonical(url);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
  }, [title, description, path, image]);
};

export default useSeo;
