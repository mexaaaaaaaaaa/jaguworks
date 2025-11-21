import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
  structuredData?: object;
}

const SEO = ({ 
  title = 'Jagmohan - Full Stack Developer & Gaming Expert',
  description = 'Professional Minecraft server developer, Discord automation specialist, and AI bot creator. Building innovative digital solutions.',
  image = 'https://i.postimg.cc/7YVhHKSt/IMG-20251108-205333.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  keywords = 'jagmohan, full stack developer, minecraft server developer, discord bot developer, telegram bots, gaming server expert, discord automation, AI bots, india developer',
  author = 'Jagmohan',
  structuredData
}: SEOProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set or update meta tags
    const setMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
      }
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author);
    setMetaTag('robots', 'index, follow, max-image-preview:large');
    
    // Set canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // Set language
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', 'en');

    // Open Graph tags
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', image);
    setMetaTag('og:url', url);
    setMetaTag('og:type', type);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Add structured data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

  }, [title, description, image, url, type, keywords, author, structuredData]);

  return null;
};

export default SEO;
