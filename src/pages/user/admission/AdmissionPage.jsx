import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { GraduationCap } from 'lucide-react';
import SEO from '../../../components/common/SEO';

const AdmissionPage = () => {
    return (
        <>
            <SEO
                title="Admission Updates"
                description="Get the latest updates on university and board admissions for 2026. Stay informed about application deadlines and procedures."
                keywords="admission, university admission, board updates, 2026 admission"
            />
            <CategoryPageTemplate
                category="Admission"
                theme="green"
                icon={GraduationCap}
                title="University & Board Admissions 2026"
                description="All latest admission forms, university notifications & board updates."
            />
        </>
    );
};

export default AdmissionPage;
