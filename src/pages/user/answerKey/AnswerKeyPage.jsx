import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Key } from 'lucide-react';

const AnswerKeyPage = () => {
    return (
        <CategoryPageTemplate
            category="Answer Key"
            theme="blue"
            icon={Key}
            title="Official Answer Keys 2026"
            description="Official answer keys with objection window details."
        />
    );
};

export default AnswerKeyPage;
