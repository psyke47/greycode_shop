import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function GoogleAnalytics() {
    const { url, component } = usePage();
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    const isDev = import.meta.env.APP_ENV === 'local' || import.meta.env.APP_ENV === 'development';

    useEffect(() => {
        if (!gaId) {
            if (isDev) console.warn('❌ GA4: No tracking ID found in .env');
            return;
        }

        if (isDev) console.log('🔍 GA4: Initializing with ID:', gaId);

        // Check if script already exists
        if (document.querySelector(`script[src*="gtag/js?id=${gaId}"]`)) {
            if (isDev) console.log('⏭️ GA script already loaded');
            return;
        }

        // Load GA script
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', gaId, {
            send_page_view: true,
            debug_mode: isDev ? true : false,
        });

        if (isDev) console.log('✅ GA4 initialized in debug mode!');

        // Expose GA to window for testing
        window.__ga = {
            id: gaId,
            isLoaded: () => typeof window.gtag === 'function',
            dataLayer: () => window.dataLayer,
            trackEvent: (eventName, params = {}) => {
                if (window.gtag) {
                    window.gtag('event', eventName, params);
                    console.log('✅ Event sent:', eventName, params);
                } else {
                    console.warn('❌ gtag not loaded');
                }
            },
            debug: () => {
                console.log('=== GA4 Debug Info ===');
                console.log('ID:', gaId);
                console.log('Loaded:', typeof window.gtag === 'function');
                console.log('dataLayer:', window.dataLayer);
                console.log('Script tag:', document.querySelector('script[src*="googletagmanager.com"]'));
                console.log('=== End Debug ===');
            }
        };
        console.log('💡 Run window.__ga.debug() in console to check GA status');

        return () => {
            // Optional cleanup
        };
    }, [gaId]);

    // Track page views on navigation
    useEffect(() => {
        if (!gaId || !window.gtag) return;

        window.gtag('event', 'page_view', {
            page_path: url,
            page_title: document.title || 'Greycode Store',
            page_location: window.location.href,
        });

        if (isDev) console.log('📄 Page view tracked:', url);
    }, [gaId, url]);

    return null;
}