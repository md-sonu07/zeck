import React from 'react';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { GraduationCap } from 'lucide-react';

const AdmissionPage = () => {
    return (
        <CategoryPageTemplate
            category="Admission"
            theme="green"
            icon={GraduationCap}
            title="University & Board Admissions 2026"
            description="All latest admission forms, university notifications & board updates."
        />
    );
};

export default AdmissionPage;
