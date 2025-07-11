// Advanced SEO Service for Digital Marketing Optimization

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface LocalSEOData {
  businessName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  latitude: number;
  longitude: number;
}

class SEOService {
  private static instance: SEOService;

  public static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  // Update meta tags for better SEO
  public updateMetaTags(metadata: SEOMetadata): void {
    // Update title
    document.title = metadata.title;

    // Update or create meta tags
    this.setMetaTag('description', metadata.description);
    this.setMetaTag('keywords', metadata.keywords.join(', '));
    this.setMetaTag('author', metadata.author || 'Ghar PG');

    // Open Graph tags for social media
    this.setMetaProperty('og:title', metadata.title);
    this.setMetaProperty('og:description', metadata.description);
    this.setMetaProperty('og:type', metadata.type || 'website');
    this.setMetaProperty('og:url', metadata.url || window.location.href);
    if (metadata.image) {
      this.setMetaProperty('og:image', metadata.image);
    }

    // Twitter Card tags
    this.setMetaProperty('twitter:card', 'summary_large_image');
    this.setMetaProperty('twitter:title', metadata.title);
    this.setMetaProperty('twitter:description', metadata.description);
    if (metadata.image) {
      this.setMetaProperty('twitter:image', metadata.image);
    }

    // Article specific tags
    if (metadata.type === 'article') {
      if (metadata.publishedTime) {
        this.setMetaProperty('article:published_time', metadata.publishedTime);
      }
      if (metadata.modifiedTime) {
        this.setMetaProperty('article:modified_time', metadata.modifiedTime);
      }
    }
  }

  // Generate structured data for search engines
  public generateStructuredData(type: 'Organization' | 'LocalBusiness' | 'Product' | 'BreadcrumbList', data: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';

    let structuredData: any;

    switch (type) {
      case 'Organization':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Ghar PG",
          "description": "Premium PG Booking Platform in India",
          "url": "https://ghar-pg.com",
          "logo": "https://ghar-pg.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9876543210",
            "contactType": "Customer Service"
          },
          "sameAs": [
            "https://facebook.com/ghar-pg",
            "https://twitter.com/ghar_pg",
            "https://instagram.com/ghar_pg"
          ]
        };
        break;

      case 'LocalBusiness':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          ...data
        };
        break;

      case 'Product':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Product",
          ...data
        };
        break;

      case 'BreadcrumbList':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data
        };
        break;
    }

    script.innerHTML = JSON.stringify(structuredData);
    
    // Remove existing structured data of same type
    const existing = document.querySelector(`script[type="application/ld+json"][data-type="${type}"]`);
    if (existing) {
      existing.remove();
    }

    script.setAttribute('data-type', type);
    document.head.appendChild(script);
  }

  // Generate sitemap data for SEO
  public generateSitemapUrls(): string[] {
    const baseUrl = window.location.origin;
    const staticPages = [
      '/',
      '/search',
      '/about',
      '/contact',
      '/faq',
      '/pricing',
      '/login',
      '/register',
      '/list-pg'
    ];

    // Add dynamic PG pages (you would fetch actual PG IDs)
    const pgPages = [
      '/pg/sample-pg-1',
      '/pg/sample-pg-2',
      '/pg/sample-pg-3'
    ];

    // Add city-specific pages
    const cityPages = [
      '/search?city=bangalore',
      '/search?city=mumbai',
      '/search?city=delhi',
      '/search?city=pune',
      '/search?city=hyderabad',
      '/search?city=chennai'
    ];

    return [...staticPages, ...pgPages, ...cityPages].map(path => `${baseUrl}${path}`);
  }

  // Track user interactions for analytics
  public trackUserInteraction(event: string, properties: Record<string, any>): void {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', event, properties);
    }

    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
      fbq('track', event, properties);
    }

    // Custom analytics
    this.sendAnalyticsEvent(event, properties);
  }

  // SEO-optimized URL generation
  public generateSEOUrl(title: string, id: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return `/pg/${slug}-${id}`;
  }

  // Generate canonical URLs to prevent duplicate content
  public setCanonicalUrl(url?: string): void {
    const canonicalUrl = url || window.location.href.split('?')[0];
    
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', canonicalUrl);
  }

  // Private helper methods
  private setMetaTag(name: string, content: string): void {
    if (!content) return;
    
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  private setMetaProperty(property: string, content: string): void {
    if (!content) return;
    
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  private sendAnalyticsEvent(event: string, properties: Record<string, any>): void {
    // Send to custom analytics endpoint
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(console.error);
  }
}

// Export singleton instance
export const seoService = SEOService.getInstance();

// Declare global functions for TypeScript
declare global {
  function gtag(...args: any[]): void;
  function fbq(...args: any[]): void;
}
