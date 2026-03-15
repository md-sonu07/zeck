import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { FileText } from 'lucide-react';
import SEO from '../../../components/common/SEO';

const AdmitCardPage = () => {
    return (
        <>
            <SEO
                title="Admit Cards"
                description="Download your admit cards for all upcoming government exams in 2026. Get direct links to official hall tickets and exam schedules."
                keywords="admit card, hall ticket, exam 2026, download admit card"
            />
            <CategoryPageTemplate
                category="Admit Card"
                theme="blue"
                icon={FileText}
                title="Download Admit Card 2026"
                description="Download hall tickets for all upcoming government exams."
            />
        </>
    );
};

export default AdmitCardPage;
