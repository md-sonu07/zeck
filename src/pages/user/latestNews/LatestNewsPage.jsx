import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Newspaper } from 'lucide-react';

const LatestNewsPage = () => {
    return (
        <CategoryPageTemplate
            theme="primary"
            icon={Newspaper}
            title="Latest News & Updates 2026"
            description="Stay updated with the latest notifications and educational news."
            limit={100}
        />
    );
};

export default LatestNewsPage;
