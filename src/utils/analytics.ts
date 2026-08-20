import { track } from '@vercel/analytics';

/**
 * Safe wrapper for Vercel Analytics event tracking.
 * Only records genuine user interactions (no synthetic/fake events).
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null>
) {
  try {
    if (typeof window !== 'undefined') {
      track(eventName, properties);
    }
  } catch (err) {
    // Non-blocking: fail silently if analytics is disabled or blocked
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics Event: ${eventName}]`, properties);
    }
  }
}

/**
 * Ensures strictly ONE canonical link tag in document.head matching the target URL.
 * Removes any obsolete or duplicate canonical tags during SPA route transitions.
 */
export function updateCanonicalUrl(canonicalUrl: string) {
  if (typeof document === 'undefined') return;

  const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
  if (canonicalLinks.length > 0) {
    canonicalLinks[0].setAttribute('href', canonicalUrl);
    // Remove any extra duplicates that may have been created
    for (let i = 1; i < canonicalLinks.length; i++) {
      canonicalLinks[i].remove();
    }
  } else {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }
}
