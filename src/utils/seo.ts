// SEO utilities for better search engine optimization
export const updateMetaTags = (data: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}) => {
  // Update title
  if (data.title) {
    document.title = `${data.title} | Ghar - Best PG Booking Platform`;
  }

  // Update meta description
  updateMetaTag('description', data.description || 'Find and book the best PG accommodations in India. Verified properties, instant booking, secure payments.');

  // Update meta keywords
  updateMetaTag('keywords', data.keywords || 'PG booking, paying guest, accommodation, hostel, rooms, rent, India');

  // Update Open Graph tags
  updateMetaTag('og:title', data.title || 'Ghar - Best PG Booking Platform');
  updateMetaTag('og:description', data.description || 'Find and book the best PG accommodations in India');
  updateMetaTag('og:image', data.image || '/og-image.jpg');
  updateMetaTag('og:url', data.url || window.location.href);
  updateMetaTag('og:type', 'website');

  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', data.title || 'Ghar - Best PG Booking Platform');
  updateMetaTag('twitter:description', data.description || 'Find and book the best PG accommodations in India');
  updateMetaTag('twitter:image', data.image || '/og-image.jpg');
};

const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

// Generate structured data for search engines
export const generateStructuredData = (type: 'PG' | 'Organization' | 'BreadcrumbList', data: any) => {
  let structuredData: any = {};

  switch (type) {
    case 'PG':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: data.name,
        description: data.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.location.address,
          addressLocality: data.location.city,
          addressRegion: data.location.state,
          postalCode: data.location.pincode,
          addressCountry: 'IN'
        },
        geo: data.location.coordinates ? {
          '@type': 'GeoCoordinates',
          latitude: data.location.coordinates[1],
          longitude: data.location.coordinates[0]
        } : undefined,
        image: data.images,
        priceRange: data.roomTypes ? `₹${Math.min(...data.roomTypes.map((r: any) => r.price))} - ₹${Math.max(...data.roomTypes.map((r: any) => r.price))}` : undefined,
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating.overall,
          reviewCount: data.reviewCount
        } : undefined,
        amenityFeature: Object.entries(data.amenities || {})
          .filter(([_, value]) => value)
          .map(([key]) => ({
            '@type': 'LocationFeatureSpecification',
            name: key,
            value: true
          }))
      };
      break;

    case 'Organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ghar',
        description: 'Best PG Booking Platform in India',
        url: 'https://gharapp.com',
        logo: 'https://gharapp.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-9907002817',
          contactType: 'customer service',
          availableLanguage: ['English', 'Hindi']
        },
        sameAs: [
          'https://facebook.com/gharapp',
          'https://twitter.com/gharapp',
          'https://instagram.com/gharapp'
        ]
      };
      break;

    case 'BreadcrumbList':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };
      break;
  }

  // Insert structured data into page
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  
  // Remove existing structured data of same type
  const existing = document.querySelector(`script[type="application/ld+json"][data-type="${type}"]`);
  if (existing) {
    existing.remove();
  }
  
  script.setAttribute('data-type', type);
  document.head.appendChild(script);
};

// Generate sitemap data
export const generateSitemapUrls = (pgs: any[]) => {
  const baseUrl = 'https://gharapp.com';
  const urls = [
    { url: baseUrl, priority: 1.0, changefreq: 'daily' },
    { url: `${baseUrl}/search`, priority: 0.9, changefreq: 'daily' },
    { url: `${baseUrl}/about`, priority: 0.7, changefreq: 'monthly' },
    { url: `${baseUrl}/contact`, priority: 0.7, changefreq: 'monthly' },
    { url: `${baseUrl}/faq`, priority: 0.6, changefreq: 'monthly' }
  ];

  // Add PG URLs
  pgs.forEach(pg => {
    urls.push({
      url: `${baseUrl}/pg/${pg._id}`,
      priority: 0.8,
      changefreq: 'weekly'
    });
  });

  // Add city pages
  const cities = Array.from(new Set(pgs.map(pg => pg.location.city)));
  cities.forEach(city => {
    urls.push({
      url: `${baseUrl}/search?city=${encodeURIComponent(city)}`,
      priority: 0.7,
      changefreq: 'daily'
    });
  });

  return urls;
};

// Track page views for analytics
export const trackPageView = (page: string, title?: string) => {
  // Google Analytics
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: title,
      page_location: window.location.href
    });
  }

  // Facebook Pixel
  if (typeof (window as any).fbq !== 'undefined') {
    (window as any).fbq('track', 'PageView');
  }
};

// Generate canonical URL
export const setCanonicalUrl = (url?: string) => {
  const canonical = url || window.location.href.split('?')[0];
  
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  
  link.href = canonical;
};