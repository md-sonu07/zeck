import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Book } from 'lucide-react';
import SEO from '../../../components/common/SEO';

const SyllabusPage = () => {
    return (
        <>
            <SEO
                title="Exam Syllabus"
                description="Access the complete syllabus and exam patterns for all government exams in 2026. Prepare better with detailed subject-wise breakdown."
                keywords="exam syllabus, exam pattern, 2026 syllabus, government exam preparation"
            />
            <CategoryPageTemplate
                category="Syllabus"
                theme="green"
                icon={Book}
                title="Exam Syllabus 2026"
                description="Complete syllabus & exam pattern for all government exams."
            />
        </>
    );
};

export default SyllabusPage;
