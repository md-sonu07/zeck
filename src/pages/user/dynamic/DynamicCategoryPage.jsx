import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPageSections } from '../../../store/thunk/pageSectionThunk';
import CategoryPageTemplate from '../../../components/common/CategoryPageTemplate';
import { Layout } from 'lucide-react';
import SEO from '../../../components/common/SEO';

const DynamicCategoryPage = () => {
    const { categorySlug } = useParams();
    const dispatch = useDispatch();
    const { sections, loading: sectionsLoading } = useSelector((state) => state.pageSections);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (sections.length === 0) {
                    await dispatch(fetchPageSections()).unwrap();
                }
            } catch (error) {
                console.error('Failed to load sections:', error);
            } finally {
                setIsChecking(false);
            }
        };
        loadData();
    }, [dispatch, sections.length]);

    // Find the section during render for stability
    const matchedSection = sections.find(
        (s) => s.title?.toLowerCase().replace(/\s+/g, '-') === categorySlug
    );

    if (sectionsLoading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="size-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!matchedSection) {
        console.warn(`No section found for slug: ${categorySlug}. Redirecting to home.`);
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <SEO 
                title={`${matchedSection.title} - Zoya Education Centre`}
                description={`Latest updates, notifications and resources for ${matchedSection.title}.`}
            />
            <CategoryPageTemplate
                category={matchedSection.title}
                theme="amber"
                icon={Layout}
                title={`${matchedSection.title} 2026`}
                description={`Explore the latest updates and resources for ${matchedSection.title}.`}
            />
        </>
    );
};

export default DynamicCategoryPage;
