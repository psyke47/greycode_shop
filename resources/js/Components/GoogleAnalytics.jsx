import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function GoogleAnalytics() {
    const { url, component } = usePage();
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

    useEffect(() => {
        if (!gaId) return;

        // Load Google Analytics script
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', gaId);

        // Clean up (optional - but GA scripts are usually global)
        return () => {
            // Remove script on unmount
            const scriptTag = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${gaId}"]`);
            if (scriptTag) scriptTag.remove();
        };
    }, [gaId]);

    // Track page views on Inertia navigation
    useEffect(() => {
        if (!gaId || !window.gtag) return;
        
        window.gtag('event', 'page_view', {
            page_path: url,
            page_title: document.title || 'Greycode Store'
        });
    }, [gaId, url]);

    return null;
}