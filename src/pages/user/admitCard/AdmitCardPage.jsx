import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { FileText } from 'lucide-react';

const AdmitCardPage = () => {
    return (
        <CategoryPageTemplate
            category="Admit Card"
            theme="blue"
            icon={FileText}
            title="Download Admit Card 2026"
            description="Download hall tickets for all upcoming government exams."
        />
    );
};

export default AdmitCardPage;
