import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { School } from 'lucide-react';

const UniversityPage = () => {
    return (
        <CategoryPageTemplate
            category="University"
            theme="indigo"
            icon={School}
            title="Top Universities in India 2026"
            description="Explore rankings, courses, and admission details for premier institutions."
        />
    );
};

export default UniversityPage;
