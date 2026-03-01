import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Book } from 'lucide-react';

const SyllabusPage = () => {
    return (
        <CategoryPageTemplate
            category="Syllabus"
            theme="green"
            icon={Book}
            title="Exam Syllabus 2026"
            description="Complete syllabus & exam pattern for all government exams."
        />
    );
};

export default SyllabusPage;
