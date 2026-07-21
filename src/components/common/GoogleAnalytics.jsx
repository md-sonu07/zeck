import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * GoogleAnalytics - Tracks route changes and sends pageview events to GA4.
 * This component should be placed inside the <Router> context.
 * 
 * The gtag script itself is loaded in index.html.
 * This component only handles SPA route-change tracking.
 */
const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Send a pageview event to Google Analytics on every route change
        if (typeof window.gtag === 'function') {
            window.gtag('config', 'G-VG6Q19W9J0', {
                page_path: location.pathname + location.search,
                page_title: document.title,
            });
        }
    }, [location]);

    return null; // This component doesn't render anything
};

export default GoogleAnalytics;
