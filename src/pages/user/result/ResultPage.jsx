import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Trophy } from 'lucide-react';
import SEO from '../../../components/common/SEO';

const ResultPage = () => {
    return (
        <>
            <SEO
                title="Exam Results"
                description="Check your government exam results for 2026. Stay updated with the latest result announcements and merit lists."
                keywords="exam results, 2026 results, merit list, government results"
            />
            <CategoryPageTemplate
                category="Result"
                theme="green"
                icon={Trophy}
                title="Exam Results 2026"
                description="Check your result for all government exams here."
            />
        </>
    );
};

export default ResultPage;
