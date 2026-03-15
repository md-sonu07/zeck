import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Newspaper } from 'lucide-react';
import SEO from '../../../components/common/SEO';

const LatestNewsPage = () => {
    return (
        <>
            <SEO
                title="Latest News & Updates"
                description="Stay updated with the latest notifications, educational news, and government job alerts for 2026. Real-time updates at your fingertips."
                keywords="latest news, education news, government job alerts, 2026 notifications"
            />
            <CategoryPageTemplate
                theme="primary"
                icon={Newspaper}
                title="Latest News & Updates 2026"
                description="Stay updated with the latest notifications and educational news."
                limit={100}
            />
        </>
    );
};

export default LatestNewsPage;
