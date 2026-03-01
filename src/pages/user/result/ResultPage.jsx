import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Trophy } from 'lucide-react';

const ResultPage = () => {
    return (
        <CategoryPageTemplate 
            category="Result" 
            theme="green" 
            icon={Trophy} 
            title="Exam Results 2026"
            description="Check your result for all government exams here."
        />
    );
};

export default ResultPage;
